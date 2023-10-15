import * as core from '@actions/core'
import { Octokit } from '@octokit/action'
import * as fs from 'node:fs/promises'
import path from 'node:path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
	const organization = process.env.GITHUB_REPOSITORY_OWNER
	const workspace = process.env.GITHUB_WORKSPACE

	if (!organization) {
		throw new RangeError(`process.env.GITHUB_REPOSITORY_OWNER must not be falsey`)
	}
	if (!workspace) {
		throw new RangeError(`process.env.GITHUB_WORKSPACE must not be falsey`)
	}
	console.error('TEST')
	core.debug('test')
	const octokit = new Octokit()
	const repositories = await octokit.repos.listForOrg({
		org: organization,
		type: 'all',
		per_page: 100,
	})
	const readmeContent = await fs.readFile(path.join(workspace, 'README.md'))
	for (const repository of repositories.data) {
		if (!readmeContent.includes(repository.url)) {
			throw new Error(`Expected to find URL in README: ${repository.url}`)
		}
	}
}
