/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const chalk = require('chalk');
const execa = require('execa');
const inquirer = require('inquirer');
const Listr = require('listr');
const readPkgUp = require('read-pkg-up');
const path = require('path');
const rimraf = require('rimraf');
const semver = require('semver');
const minimist = require('minimist');


const rootDir = path.join(__dirname, '../');
const scriptsDir = path.join(rootDir, 'scripts');
const dstDir = path.join(rootDir, 'dist');


function runTasks(opts) {
	const pkg = readPkg();

	const tasks = [];
	let newVersion;

	if (opts.publish) {
		tasks.push(
			{
				title: 'Validate version',
				task: () => {
					if (!isValidVersionInput(opts.version)) {
						throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
					}

					newVersion = getNewVersion(pkg.version, opts.version);

					if (!isVersionGreater(pkg.version, newVersion)) {
						throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
					}
				}
			},
			{
				title: 'Check for pre-release version',
				task: () => {
					if (!pkg.private && isPrereleaseVersion(newVersion) && !opts.tag) {
						throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
					}
				}
			},
			{
				title: 'Check npm version',
				skip: () => isVersionLower('6.0.0', process.version),
				task: () => execa.stdout('npm', ['version', '--json']).then(json => {
					const versions = JSON.parse(json);
					if (!satisfies(versions.npm, '>=2.15.8 <3.0.0 || >=3.10.1')) {
						throw new Error(`npm@${versions.npm} has known issues publishing when running Node.js 6. Please upgrade npm or downgrade Node and publish again. https://github.com/npm/npm/issues/5082`);
					}
				})
			},
			{
				title: 'Check git tag existence',
				task: () => execa('git', ['fetch'])
					.then(() => {
						return execa.stdout('npm', ['config', 'get', 'tag-version-prefix']);
					})
					.then(
						output => {
							tagPrefix = output;
						},
						() => {}
					)
					.then(() => execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]))
					.then(
						output => {
							if (output) {
								throw new Error(`Git tag \`${tagPrefix}${newVersion}\` already exists.`);
							}
						},
						err => {
							// Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
							// https://github.com/sindresorhus/np/pull/73#discussion_r72385685
							if (err.stdout !== '' || err.stderr !== '') {
								throw err;
							}
						}
					)
			},
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
			},
			{
				title: 'Cleanup',
				task: () => new Promise((resolve, reject) => {
					rimraf('node_modules', (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}});
				})
			},
			{
				title: 'Install root dependencies',
				task: () => execa('npm', ['install', '--no-package-lock'], { cwd: rootDir }),
			}
		)
	}

	tasks.push(
		{
			title: 'Build @stencil/core',
			task: () => execa('npm', ['run', 'build'], { cwd: rootDir })
		},
		{
			title: 'Run tests',
			task: () => execa('npm', ['test'], { cwd: rootDir })
		}
	);

	if (opts.publish) {
		tasks.push(
			{
				title: 'Bump package.json version',
				task: () => execa('npm', ['version', opts.version], { cwd: rootDir }),
			}
		);
	}

	tasks.push(
		{
			title: 'Prepare "dist" @stencil/core package',
			task: () => execa('npm', ['run', 'prepare.package'], { cwd: scriptsDir })
		},
		{
			title: 'Build "dist" @stencil/core local dependencies',
			task: () => execa('npm', ['run', 'build.deps'], { cwd: scriptsDir })
		}
	);

	if (opts.publish) {
		// publish
		tasks.push(
			{
				title: 'Publish "dist" @stencil/core package',
				task: () => execa('npm', ['publish'].concat(opts.tag ? ['--tag', opts.tag] : []), { cwd: dstDir })
			},
			{
				title: 'Pushing to Github',
				task: () => execa('git', ['push', '--follow-tags'], { cwd: rootDir })
			}
		);

	} else {
		// dry run
		tasks.push(
			{
				title: 'Install "dist" @stencil/core dependencies',
				task: () => execa('npm', ['install', '--no-package-lock'], { cwd: dstDir })
			},
			{
				title: 'Create dist/core.tar.gz package',
				task: () => execa('tar', ['-zcf', 'core.tar.gz', './'], { cwd: dstDir }),
			}
		);
	}

	const listr = new Listr(tasks, { showSubtasks: false });

	return listr.run()
		.then(() => {
			if (opts.publish) {
				console.log(`\n ${pkg.name} ${newVersion} published 🎉\n`);
			} else {
				console.log(`\n ${pkg.name} dryrun finished 🕵️\n`);
			}
		})
		.catch(err => {
			console.log('\n', chalk.red(err), '\n');
			process.exit(0);
		});
}


function deployUI() {
	const pkg = readPkg();
	const oldVersion = pkg.version;

	console.log(`\nPublish a new version of ${chalk.bold.magenta(pkg.name)} ${chalk.dim(`(${oldVersion})`)}\n`);

	const prompts = [
		{
			type: 'list',
			name: 'version',
			message: 'Select semver increment or specify new version',
			pageSize: SEMVER_INCREMENTS.length + 2,
			choices: SEMVER_INCREMENTS
				.map(inc => ({
					name: `${inc} 	${prettyVersionDiff(oldVersion, inc)}`,
					value: inc
				}))
				.concat([
					new inquirer.Separator(),
					{
						name: 'Other (specify)',
						value: null
					}
				]),
			filter: input => isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input
		},
		{
			type: 'input',
			name: 'version',
			message: 'Version',
			when: answers => !answers.version,
			filter: input => isValidVersionInput(input) ? getNewVersion(pkg.version, input) : input,
			validate: input => {
				if (!isValidVersionInput(input)) {
					return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
				} else if (!isVersionGreater(oldVersion, input)) {
					return `Version must be greater than ${oldVersion}`;
				}

				return true;
			}
		},
		{
			type: 'list',
			name: 'tag',
			message: 'How should this pre-release version be tagged in npm?',
			when: answers => isPrereleaseVersion(answers.version),
			choices: () => execa.stdout('npm', ['view', '--json', pkg.name, 'dist-tags'])
				.then(stdout => {
					const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
						.filter(tag => tag !== 'latest');

					if (existingPrereleaseTags.length === 0) {
						existingPrereleaseTags.push('next');
					}

					return existingPrereleaseTags
						.concat([
							new inquirer.Separator(),
							{
								name: 'Other (specify)',
								value: null
							}
						]);
				})
		},
		{
			type: 'input',
			name: 'tag',
			message: 'Tag',
			when: answers => !pkg.private && isPrereleaseVersion(answers.version) && !answers.tag,
			validate: input => {
				if (input.length === 0) {
					return 'Please specify a tag, for example, `next`.';
				} else if (input.toLowerCase() === 'latest') {
					return 'It\'s not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next`.';
				}
				return true;
			}
		},
		{
			type: 'confirm',
			name: 'confirm',
			message: answers => {
				const tag = answers.tag;
				const tagPart = tag ? ` and tag this release in npm as ${tag}` : '';

				return `Will bump from ${chalk.cyan(oldVersion)} to ${chalk.cyan(answers.version + tagPart)}. Continue?`;
			}
		}
	];

	return inquirer
		.prompt(prompts)
		.then(answers => {
			answers.publish = true;
			runTasks(answers);
		})
		.catch(err => {
			console.log('\n', chalk.red(err), '\n');
			process.exit(0);
		});
}


const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];

const isValidVersion = input => Boolean(semver.valid(input));

const isValidVersionInput = input => SEMVER_INCREMENTS.indexOf(input) !== -1 || isValidVersion(input);

const isPrereleaseVersion = version => PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver.prerelease(version));

function getNewVersion(oldVersion, input) {
	if (!isValidVersionInput(input)) {
		throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
	}

	return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
};

const isVersionGreater = (oldVersion, newVersion) => {
	if (!isValidVersion(newVersion)) {
		throw new Error('Version should be a valid semver version.');
	}

	return semver.gt(newVersion, oldVersion);
};

const isVersionLower = (oldVersion, newVersion) => {
	if (!isValidVersion(newVersion)) {
		throw new Error('Version should be a valid semver version.');
	}

	return semver.lt(newVersion, oldVersion);
};

const satisfies = (version, range) => semver.satisfies(version, range);

const readPkg = () => {
	const pkg = readPkgUp.sync().pkg;

	if (!pkg) {
		throw new Error(`No package.json found. Make sure you're in the correct project.`);
	}

	return pkg;
};


function prettyVersionDiff(oldVersion, inc) {
	const newVersion = getNewVersion(oldVersion, inc).split('.');
	oldVersion = oldVersion.split('.');
	let firstVersionChange = false;
	const output = [];

	for (let i = 0; i < newVersion.length; i++) {
		if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
			output.push(`${chalk.dim.cyan(newVersion[i])}`);
			firstVersionChange = true;
		} else if (newVersion[i].indexOf('-') >= 1) {
			let preVersion = [];
			preVersion = newVersion[i].split('-');
			output.push(`${chalk.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
		} else {
			output.push(chalk.reset.dim(newVersion[i]));
		}
	}
	return output.join(chalk.reset.dim('.'));
}


var publish = process.argv.slice(2).indexOf('--dry-run') === -1;

if (publish) {
	deployUI();
} else {
	runTasks({ publish: false, version: '0.0.1-test', tag: 'test' });
}
