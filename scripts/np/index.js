'use strict';
const execa = require('execa');
const del = require('del');
const path = require('path');
const Listr = require('listr');
const split = require('split');
require('any-observable/register/rxjs-all'); // eslint-disable-line import/no-unassigned-import
const Observable = require('any-observable');
const streamToObservable = require('stream-to-observable');
const readPkgUp = require('read-pkg-up');
const hasYarn = require('has-yarn');
const prerequisiteTasks = require('./lib/prerequisite');
const gitTasks = require('./lib/git');
const util = require('./lib/util');

const exec = (cmd, args, opts) => {
	// Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
	const cp = execa(cmd, args, opts);

	return Observable.merge(
		streamToObservable(cp.stdout.pipe(split()), {await: cp}),
		streamToObservable(cp.stderr.pipe(split()), {await: cp})
	).filter(Boolean);
};

module.exports = (input, opts) => {
	input = input || 'patch';

	opts = Object.assign({
		cleanup: true,
		publish: true,
		yarn: false
	}, opts);

	const runTests = !opts.yolo;
	const runCleanup = opts.cleanup && !opts.yolo;
	const runPublish = opts.publish;
	const runGit = opts.git;
	const pkg = util.readPkg();

	const tasks = new Listr([
		{
			title: 'Prerequisite check',
			task: () => prerequisiteTasks(input, pkg, opts)
		},
		{
			title: 'Git',
			task: () => gitTasks(opts)
		}
	], {
		showSubtasks: false
	});

	if (runCleanup) {
		tasks.add([
			{
				title: 'Cleanup',
				task: () => del('node_modules')
			},
			{
				title: 'Install npm dependencies',
				task: () => exec('npm', ['install', '--no-package-lock'])
			}
		]);
	}

	tasks.add({
		title: 'Build @stencil/core',
		task: () => {
			return exec('npm', ['run', 'build'], { cwd: path.join(__dirname, '../..') });
		}
	});

	if (runTests) {
		tasks.add({
			title: 'Run tests',
			task: () => exec('npm', ['test'])
		});
	}

	tasks.add([
		{
			title: 'Bump package.json version',
			task: () => {
				return exec('npm', ['version', input], { cwd: path.join(__dirname, '../..') });
			}
		},
		{
			title: 'Create "dist" @stencil/core package',
			task: () => {
				return exec('node', ['./build-package'], { cwd: path.join(__dirname, '..') });
			}
		}
	]);

	if (runPublish) {
		tasks.add({
			title: 'Publish "dist" @stencil/core package',
			task: () => {
				const args = [
					'publish',
					'package.tgz',
					'--new-version',
					input
				];
				if (opts.tag) {
					args.push('--tag', opts.tag);
				}

				// yarn publish package.tgz --tag next --new-version 0.0.6-6

				// yarn cuz npm has a bug with "npm publish <tarball>""
				return exec('yarn', args, { cwd: path.join(__dirname, '../../dist') });
			}
		});

		tasks.add({
			title: 'Pushing to Github',
			task: () => exec('git', ['push', '--follow-tags'])
		});
	}

	return tasks.run()
		.then(() => readPkgUp())
		.then(result => result.pkg);
};
