'use strict'

require('dotenv').load()
const debug = require('debug')('faketravis:core')

const url = require('url')

const secret = process.env.WEBHOOK_SECRET || 'keyboardcat'
const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: secret })
const fakeTravisPr = require('./src/fake_travis_pr')

handler.on('error', function (err) {
    console.error('Error:', err.message)
})

handler.on('pull_request', function (event) {
    const payload = event.payload
    const user = payload.repository.owner.login
    const repo = payload.repository.name
    const commitHash = payload.pull_request.head.sha
    const number = payload.pull_request.number

    const pr = {
        user,
        repo,
        commitHash,
        number
    }

    const repoUrl = payload.repository.url
    const apiDomain = url.parse(repoUrl).hostname

    fakeTravisPr(apiDomain, pr)
        .then(() => {
            debug('Validation done!')
        })
        .catch(err => {
            debug('Validation error', err)
        })
})

http
    .createServer(function (req, res) {
        handler(req, res, function (err) {
            res.statusCode = 404
            res.end('no such location')
        })
    })
    .listen(process.env.PORT || 3000)

console.log('Waiting for webhooks....')
