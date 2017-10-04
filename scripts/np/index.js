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


// npm4 cuz npm5 has a bug with "npm publish <tarball>"
const rootDir = path.join(__dirname, '../..');
const nodeModuleBinDir = path.join(rootDir, 'node_modules/.bin');
const scriptsDir = path.join(rootDir, 'scripts');
const distDir = path.join(rootDir, 'dist');
const npmExe = path.join(nodeModuleBinDir, 'npm');


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
				task: () => exec('npm', ['install', '--no-package-lock'], { cwd: rootDir })
			}
		]);
	}

	tasks.add({
		title: 'Build @stencil/core',
		task: () => {
			return exec('node', [npmExe, 'run', 'build'], { cwd: rootDir });
		}
	});

	if (runTests) {
		tasks.add({
			title: 'Run tests',
			task: () => exec('node', [npmExe, 'test'], { cwd: rootDir })
		});
	}

	tasks.add([
		{
			title: 'Bump package.json version',
			task: () => {
				return exec('node', [npmExe, 'version', input], { cwd: rootDir });
			}
		},
		{
			title: 'Create "dist" @stencil/core package',
			task: () => {
				return exec('node', ['./build-package.js'], { cwd: scriptsDir });
			}
		}
	]);

	if (runPublish) {
		tasks.add({
			title: 'Publish "dist" @stencil/core package',
			task: () => {
				const args = [
					npmExe,
					'publish',
					'package.tgz'
				];
				if (opts.tag) {
					args.push('--tag', opts.tag);
				}

				return exec('node', args, { cwd: distDir });
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
