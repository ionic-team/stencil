import type * as d from '@stencil/core/internal';
import { isOutputTargetDistLazy, isOutputTargetWww } from '../compiler/output-targets/output-utils';
import { join, relative } from 'path';

export function shuffleArray(array: any[]) {
  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;
  let temporaryValue: any;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Testing utility to validate the existence of some provided file paths using a specific file system
 *
 * @param fs the file system to use to validate the existence of some files
 * @param filePaths the paths to validate
 * @throws when one or more of the provided file paths cannot be found
 */
export function expectFiles(fs: d.InMemoryFileSystem, filePaths: string[]): void {
  const notFoundFiles: ReadonlyArray<string> = filePaths.filter((filePath: string) => !fs.statSync(filePath).exists);

  if (notFoundFiles.length > 0) {
    throw new Error(
      `The following files were expected, but could not be found:\n${notFoundFiles
        .map((result: string) => '-' + result)
        .join('\n')}`
    );
  }
}

/**
 * Testing utility to validate the non-existence of some provided file paths using a specific file system
 *
 * @param fs the file system to use to validate the non-existence of some files
 * @param filePaths the paths to validate
 * @throws when one or more of the provided file paths is found
 */
export function doNotExpectFiles(fs: d.InMemoryFileSystem, filePaths: string[]): void {
  const existentFiles: ReadonlyArray<string> = filePaths.filter((filePath: string) => fs.statSync(filePath).exists);

  if (existentFiles.length > 0) {
    throw new Error(
      `The following files were expected to not exist, but do:\n${existentFiles
        .map((result: string) => '-' + result)
        .join('\n')}`
    );
  }
}

export function getAppScriptUrl(config: d.Config, browserUrl: string) {
  const appFileName = `${config.fsNamespace}.esm.js`;
  return getAppUrl(config, browserUrl, appFileName);
}

export function getAppStyleUrl(config: d.Config, browserUrl: string) {
  if (config.globalStyle) {
    const appFileName = `${config.fsNamespace}.css`;
    return getAppUrl(config, browserUrl, appFileName);
  }
  return null;
}

function getAppUrl(config: d.Config, browserUrl: string, appFileName: string) {
  const wwwOutput = config.outputTargets.find(isOutputTargetWww);
  if (wwwOutput) {
    const appBuildDir = wwwOutput.buildDir;
    const appFilePath = join(appBuildDir, appFileName);
    const appUrlPath = relative(wwwOutput.dir, appFilePath);
    const url = new URL(appUrlPath, browserUrl);
    return url.href;
  }

  const distOutput = config.outputTargets.find(isOutputTargetDistLazy);
  if (distOutput) {
    const appBuildDir = distOutput.esmDir;
    const appFilePath = join(appBuildDir, appFileName);
    const appUrlPath = relative(config.rootDir, appFilePath);
    const url = new URL(appUrlPath, browserUrl);
    return url.href;
  }

  return browserUrl;
}
