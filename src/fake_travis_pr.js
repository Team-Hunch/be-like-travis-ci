'use strict'

const debug = require('debug')('faketravis:validate')
const getGithubConnector = require('./github_connector')

function updateStatus(github, pr, state, description) {
    const user = pr.user
    const repo = pr.repo
    const commitHash = pr.commitHash

    const msg = {
        user,
        repo,
        sha: commitHash,
        state,
        description,
        context: 'continuous-integration/travis-ci/pr'
    }

    debug('Updating pull request for: ', JSON.stringify(msg))

    return github.repos(user, repo).statuses(commitHash).create(msg)
}


function fakeTravisPr(apiEndpoint, pr) {
    debug('Validate for endpoint:', apiEndpoint)

    const github = getGithubConnector(apiEndpoint)

    return updateStatus(github, pr, 'pending', 'Travis will handle it later')

}

module.exports = fakeTravisPr
