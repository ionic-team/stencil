import fs from 'fs-extra';
import execa from 'execa';
import color from 'ansi-colors';
import semver from 'semver';
import open from 'open';
import { BuildOptions } from './options';
import { join } from 'path';

export const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];

export const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];

export const isValidVersion = (input: string) => Boolean(semver.valid(input));

export const isValidVersionInput = (input: string) => SEMVER_INCREMENTS.indexOf(input) !== -1 || isValidVersion(input);

export const isPrereleaseVersion = (version: string) => PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver.prerelease(version));

export function getNewVersion(oldVersion: string, input: any): string {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
}

export const isVersionGreater = (oldVersion: string, newVersion: string) => {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.gt(newVersion, oldVersion);
};

export function prettyVersionDiff(oldVersion: any, inc: any) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if (newVersion[i] !== oldVersion[i] && !firstVersionChange) {
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

export async function updateChangeLog(opts: BuildOptions) {
  const ccPath = join(opts.nodeModulesDir, '.bin', 'conventional-changelog');
  await execa('node', [ccPath, '-p', 'angular', '-o', '-i', opts.changelogPath, '-s'], { cwd: opts.rootDir });

  let changelog = await fs.readFile(opts.changelogPath, 'utf8');
  changelog = changelog.replace(/\# \[/, '# ' + opts.vermoji + ' [');
  await fs.writeFile(opts.changelogPath, changelog);
}

export async function postGithubRelease(opts: BuildOptions) {
  const versionTag = `v${opts.version}`;
  const title = `${opts.vermoji} ${opts.version}`;

  const lines = (await fs.readFile(opts.changelogPath, 'utf8')).trim().split('\n');

  let body = '';
  for (let i = 1; i < 500; i++) {
    if (lines[i].startsWith('## ')) {
      break;
    }
    body += lines[i] + '\n';
  }

  // https://docs.github.com/en/github/administering-a-repository/automation-for-release-forms-with-query-parameters
  const url = new URL(`https://github.com/${opts.ghRepoOrg}/${opts.ghRepoName}/releases/new`);
  url.searchParams.set('tag', versionTag);
  url.searchParams.set('title', title);
  url.searchParams.set('body', body.trim());
  if (opts.tag === 'next' || opts.tag === 'test') {
    url.searchParams.set('prerelease', '1');
  }

  await open(url.href);
}
