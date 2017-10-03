'use strict';
const execa = require('execa');
const Listr = require('listr');

module.exports = opts => {
	const tasks = [
		{
			title: 'Check current branch',
			task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
				if (branch !== 'master') {
					throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
				}
			})
		},
		{
			title: 'Check local working tree',
			task: () => execa.stdout('git', ['status', '--porcelain']).then(status => {
				if (status !== '') {
					throw new Error('Unclean working tree. Commit or stash changes first.');
				}
			})
		},
		{
			title: 'Check remote history',
			task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
				if (result !== '0') {
					throw new Error('Remote history differs. Please pull changes.');
				}
			})
		}
	];

	if (opts.anyBranch) {
		tasks.shift();
	}

	return new Listr(tasks);
};
