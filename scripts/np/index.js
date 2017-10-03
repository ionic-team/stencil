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
		yarn: hasYarn()
	}, opts);

	if (!hasYarn() && opts.yarn) {
		throw new Error('Could not use Yarn without yarn.lock file');
	}

	// TODO: remove sometime far in the future
	if (opts.skipCleanup) {
		opts.cleanup = false;
	}

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
		showSubtasks: true
	});

	if (runCleanup) {
		tasks.add([
			{
				title: 'Cleanup',
				task: () => del('node_modules')
			},
			{
				title: 'Installing dependencies using Yarn',
				enabled: () => opts.yarn === true,
				task: () => exec('yarn', ['install', '--frozen-lockfile']).catch(err => {
					if (err.stderr.startsWith('error Your lockfile needs to be updated')) {
						throw new Error('yarn.lock file is outdated. Run yarn, commit the updated lockfile and try again.');
					}
					throw err;
				})
			},
			{
				title: 'Installing dependencies using npm',
				enabled: () => opts.yarn === false,
				task: () => exec('npm', ['install', '--no-package-lock'])
			}
		]);
	}

	if (runTests) {
		tasks.add({
			title: 'Running tests',
			task: () => exec('npm', ['test'])
		});
	}

	tasks.add([
		{
			title: 'Bumping "root" version using Yarn',
			enabled: () => opts.yarn === true,
			task: () => exec('yarn', ['version', '--new-version', input])
		},
		{
			title: 'Bumping "root" version using npm',
			enabled: () => opts.yarn === false,
			task: () => exec('npm', ['version', input])
		},
		{
			title: 'Bumping "dist" version using Yarn',
			enabled: () => opts.yarn === true,
			task: () => exec('yarn', ['version', '--new-version', input], {
				cwd: path.join(process.cwd(), 'dist')
			})
		},
		{
			title: 'Bumping "dist" version using npm',
			enabled: () => opts.yarn === false,
			task: () => exec('npm', ['version', input], {
				cwd: path.join(process.cwd(), 'dist')
			})
		}
	]);

	if (runPublish) {
		tasks.add({
			title: 'Publishing npm package in "dist"',
			task: () => {
				const npmInstallArgs = [
					'publish',
					'./package.tgz'
				];
				if (opts.tag) {
					npmInstallArgs.push('--tag', opts.tag);
				}

				return exec('npm', npmInstallArgs, {
					cwd: path.join(process.cwd(), 'dist')
				})
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
