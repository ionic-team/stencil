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


const rootDir = path.join(__dirname, '../..');
const scriptsDir = path.join(rootDir, 'scripts');
const dstDir = path.join(rootDir, 'dist');


module.exports = (input, opts) => {
	input = input || 'patch';

	const pkg = util.readPkg();

	const tasks = [
		{
			title: 'Prerequisite check',
			task: () => prerequisiteTasks(input, pkg, opts),
			skip: () => opts.dryRun
		},
		{
			title: 'Git',
			task: () => gitTasks(opts),
			skip: () => opts.dryRun
		},
		{
			title: 'Cleanup',
			task: () => del('node_modules')
		},
		{
			title: 'Install root dependencies',
			task: () => exec('npm', ['install', '--no-package-lock'], { cwd: rootDir })
		},
		{
			title: 'Build @stencil/core',
			task: () => exec('npm', ['run', 'build'], { cwd: rootDir })
		},
		{
			title: 'Run tests',
			task: () => exec('npm', ['test'], { cwd: rootDir })
		},
		{
			title: 'Bump package.json version',
			task: () => exec('npm', ['version', input], { cwd: rootDir }),
			skip: () => opts.dryRun
		},
		{
			title: 'Prepare "dist" @stencil/core package',
			task: () => exec('node', ['prepare-package.js'], { cwd: scriptsDir })
		},
		{
			title: 'Install "dist" @stencil/core dependencies',
			task: () => exec('npm', ['install', '--no-package-lock'], { cwd: dstDir })
		},
		{
			title: 'Dedupe "dist" @stencil/core dependencies',
			task: () => exec('npm', ['dedupe'], { cwd: dstDir })
		},
		{
			title: 'Cleanup "dist" @stencil/core package',
			task: () => exec('node', ['post-package.js'], { cwd: scriptsDir })
		},
	];

	if (opts.dryRun) {
		// dry run
		tasks.push({
			title: 'Create dist/core.tar.gz package',
			task: () => exec('tar', ['-zcf', 'core.tar.gz', './'], { cwd: dstDir }),
		});

	} else {
		// publish
		tasks.push({
			title: 'Publish "dist" @stencil/core package',
			task: () => exec('npm', ['publish'].concat(opts.tag ? ['--tag', opts.tag] : []), { cwd: dstDir })
		},
		{
			title: 'Pushing to Github',
			task: () => exec('git', ['push', '--follow-tags'], { cwd: rootDir })
		});
	}

	const listr = new Listr(tasks, { showSubtasks: false });

	return listr.run()
		.then(() => readPkgUp())
		.then(result => result.pkg);
};
