/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const color = require('ansi-colors');
const execa = require('execa');
const inquirer = require('inquirer');
const Listr = require('listr');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const { updateReleaseVersion } = require('./script-utils');


const rootDir = path.join(__dirname, '../');
const packageJsonPath = path.join(rootDir, 'package.json');


function runTasks(opts) {
  const pkg = readPkg();

  const tasks = [];
  let newVersion = getNewVersion(pkg.version, opts.version);

  if (opts.prepare) {
    tasks.push(
      {
        title: 'Validate version',
        task: () => {
          if (!isValidVersionInput(opts.version)) {
            throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
          }

          if (!isVersionGreater(pkg.version, newVersion)) {
            throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
          }
        }
      }
    );
  }

  if (opts.publish) {
    tasks.push(
      {
        title: 'Check for pre-release version',
        task: () => {
          if (!pkg.private && isPrereleaseVersion(newVersion) && !opts.tag) {
            throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
          }
        }
      }
    )
  }

  tasks.push(
    {
      title: 'Check npm version',
      skip: () => isVersionLower('6.0.0', process.version),
      task: () => execa('npm', ['version', '--json']).then(({stdout}) => {
        const versions = JSON.parse(stdout);
        if (!satisfies(versions.npm, '>=2.15.8 <3.0.0 || >=3.10.1')) {
          throw new Error(`npm@${versions.npm} has known issues publishing when running Node.js 6. Please upgrade npm or downgrade Node and publish again. https://github.com/npm/npm/issues/5082`);
        }
      })
    },
    {
      title: 'Check git tag existence',
      task: () => execa('git', ['fetch'])
        .then(() => execa('npm', ['config', 'get', 'tag-version-prefix']))
        .then(
          ({stdout}) => tagPrefix = stdout,
          () => {}
        )
        .then(() => execa('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]))
        .then(({stdout}) => {
          if (stdout) {
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
      task: () => execa('git', ['symbolic-ref', '--short', 'HEAD']).then(({stdout}) => {
        if (stdout !== 'master' && process.argv.slice(2).indexOf('--any-branch') === -1) {
          throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
        }
      })
    },
    {
      title: 'Check local working tree',
      task: () => execa('git', ['status', '--porcelain']).then(({stdout}) => {
        if (stdout !== '') {
          throw new Error('Unclean working tree. Commit or stash changes first.');
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({stdout}) => {
        if (stdout !== '0' && process.argv.slice(2).indexOf('--any-branch') === -1) {
          throw new Error('Remote history differs. Please pull changes.');
        }
      })
    }
  );

  if (opts.prepare) {
    tasks.push(
      {
        title: 'Cleanup',
        task: () => fs.remove('node_modules')
      },
      {
        title: 'Install npm dependencies',
        task: () => execa('npm', ['install'], { cwd: rootDir }),
      },
      {
        title: 'Build @stencil/core',
        task: () => execa('npm', ['run', 'build'], { cwd: rootDir })
      },
      {
        title: 'Run dist tests',
        task: () => execa('npm', ['run', 'test.dist'], { cwd: rootDir })
      },
      {
        title: 'Run jest tests',
        task: () => execa('npm', ['run', 'test.jest'], { cwd: rootDir })
      },
      {
        title: 'Run karma tests',
        task: () => execa('npm', ['run', 'test.karma.prod'], { cwd: rootDir })
      },
      {
        title: 'Run hydrate tests',
        task: () => execa('npm', ['run', 'test.hydrate'], { cwd: rootDir })
      },
      {
        title: 'Run sys/node tests',
        task: () => execa('npm', ['run', 'test.sys.node'], { cwd: rootDir })
      },
      {
        title: 'Set package.json version',
        task: async () => {
          await updateReleaseVersion(opts.version);
          return execa('npm', ['run', 'set.version', opts.version], { cwd: rootDir });
        }
      },
      {
        title: 'Generate Changelog',
        task: () => execa('npm', ['run', 'changelog'], { cwd: rootDir }),
      },
      {
        title: 'Generate Vermoji',
        task: () => execa('npm', ['run', 'vermoji'], { cwd: rootDir }),
      }
    );
  }

  if (opts.publish) {
    tasks.push(
      {
        title: 'Publish @stencil/core',
        task: () => execa(
          'npm',
          ['publish'].concat(opts.tag ? ['--tag', opts.tag] : [])
          .concat(opts.otp ? ['--otp', opts.otp] : []),
          { cwd: rootDir }
        )
      },
      {
        title: 'Tagging the latest commit',
        task: () => execa('git', ['tag', `v${opts.version}`], { cwd: rootDir })
      },
      {
        title: 'Pushing commits',
        task: () => execa('git', ['push'], { cwd: rootDir })
      },
      {
        title: 'Pushing tabs',
        task: () => execa('git', ['push', '--tags'], { cwd: rootDir })
      }
    );

    if (opts.tag !== 'next' && opts.tag !== 'test') {
      tasks.push(
        {
          title: 'Also set "next" tag on @stencil/core',
          task: () => execa(
            'npm',
            ['dist-tag', 'add', '@stencil/core@' + opts.version, 'next']
            .concat(opts.otp ? ['--otp', opts.otp] : []),
            { cwd: rootDir })
        }
      );
    }
  }

  const listr = new Listr(tasks, { showSubtasks: false });

  return listr.run()
    .then(() => {
      if (opts.prepare) {
        console.log(`\n ${pkg.name} ${newVersion} prepared, check the diffs and commit 🕵️\n`);
      } else if (opts.publish) {
        console.log(`\n ${pkg.name} ${newVersion} published!! 🎉\n`);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}


function prepareUI() {
  const pkg = readPkg();
  const oldVersion = pkg.version;

  console.log(`\nPrepare to publish a new version of ${color.bold.magenta(pkg.name)} ${color.dim(`(${oldVersion})`)}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS
        .map(inc => ({
          name: `${inc}   ${prettyVersionDiff(oldVersion, inc)}`,
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
      type: 'confirm',
      name: 'confirm',
      message: answers => {
        return `Optimize for release ${color.cyan(oldVersion)} to ${color.cyan(answers.version)}. Continue?`;
      }
    }
  ];

  return inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        answers.prepare = true;
        answers.publish = false;
        runTasks(answers);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}

function publishUI() {
  const pkg = readPkg();
  const version = pkg.version;

  console.log(`\nPublish a new version of ${color.bold.magenta(pkg.name)} ${color.dim(`(${version})`)}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'tag',
      message: 'How should this pre-release version be tagged in npm?',
      when: answers => isPrereleaseVersion(version),
      choices: () => execa('npm', ['view', '--json', pkg.name, 'dist-tags'])
        .then(({stdout}) => {
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
      when: answers => !pkg.private && isPrereleaseVersion(version) && !answers.tag,
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
      type: 'input',
      name: 'otp',
      message: 'NPM Auth code',
      when: () => process.argv.slice(2).indexOf('--otp') > -1,
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: answers => {
        const tag = answers.tag;
        const tagPart = tag ? ` and tag this release in npm as ${tag}` : '';

        return `Will publish ${color.cyan(version + tagPart)}. Continue?`;
      }
    }
  ];

  return inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        answers.version = version;
        answers.prepare = false;
        answers.publish = true;
        runTasks(answers);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
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
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
};

function prettyVersionDiff(oldVersion, inc) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
      output.push(`${color.dim.cyan(newVersion[i])}`);
      firstVersionChange = true;
    } else if (newVersion[i].indexOf('-') >= 1) {
      let preVersion = [];
      preVersion = newVersion[i].split('-');
      output.push(`${color.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
    } else {
      output.push(color.reset.dim(newVersion[i]));
    }
  }
  return output.join(color.reset.dim('.'));
}

const prepare = process.argv.slice(2).indexOf('--prepare') > -1;

if (prepare) {
  prepareUI();
} else {
  publishUI();
}
