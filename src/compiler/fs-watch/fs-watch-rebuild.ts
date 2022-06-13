import type * as d from '../../declarations';
import { basename } from 'path';
import { isString, unique } from '@utils';
import { isOutputTargetDocsJson, isOutputTargetStats, isOutputTargetDocsVscode } from '../output-targets/output-utils';

export const filesChanged = (buildCtx: d.BuildCtx) => {
  // files changed include updated, added and deleted
  return unique([...buildCtx.filesUpdated, ...buildCtx.filesAdded, ...buildCtx.filesDeleted]).sort();
};

const unaryBasename = (filePath: string) => basename(filePath);

/**
 * Get the file extension for a path
 * @param filePath a path
 * @returns the file extension (well, characters after the last `'.'`)
 */
const getExt = (filePath: string): string => filePath.split('.').pop().toLowerCase();

/**
 * Script extensions which we want to be able to recognize
 */
const SCRIPT_EXT = ['ts', 'tsx', 'js', 'jsx'];

/**
 * Helper to check if an extension is found in our list of script extensions
 * @param ext a file extension
 * @returns whether the extension is a script extension or not
 */
export const hasScriptExt = (filePath: string): boolean => SCRIPT_EXT.includes(getExt(filePath));

const STYLE_EXT = ['css', 'scss', 'sass', 'pcss', 'styl', 'stylus', 'less'];

/**
 * Helper to check if an extension is found in our list of style extensions
 * @param ext a file extension
 * @returns whether the extension is a style extension or not
 */
export const hasStyleExt = (filePath: string): boolean => STYLE_EXT.includes(getExt(filePath));

// collect all the scripts that were added
export const scriptsAdded = (buildCtx: d.BuildCtx): string[] =>
  buildCtx.filesAdded.filter(hasScriptExt).map(unaryBasename);

// collect all the scripts that were deleted
export const scriptsDeleted = (buildCtx: d.BuildCtx): string[] =>
  buildCtx.filesDeleted.filter(hasScriptExt).map(unaryBasename);

export const hasScriptChanges = (buildCtx: d.BuildCtx): boolean => buildCtx.filesChanged.some(hasScriptExt);

export const hasStyleChanges = (buildCtx: d.BuildCtx): boolean => buildCtx.filesChanged.some(hasStyleExt);

export const hasHtmlChanges = (config: d.Config, buildCtx: d.BuildCtx): boolean => {
  const anyHtmlChanged = buildCtx.filesChanged.some((f) => f.toLowerCase().endsWith('.html'));

  if (anyHtmlChanged) {
    // any *.html in any directory that changes counts and rebuilds
    return true;
  }

  const srcIndexHtmlChanged = buildCtx.filesChanged.some((fileChanged) => {
    // the src index index.html file has changed
    // this file name could be something other than index.html
    return fileChanged === config.srcIndexHtml;
  });

  return srcIndexHtmlChanged;
};

export const updateCacheFromRebuild = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  buildCtx.filesChanged.forEach((filePath) => {
    compilerCtx.fs.clearFileCache(filePath);
  });

  buildCtx.dirsAdded.forEach((dirAdded) => {
    compilerCtx.fs.clearDirCache(dirAdded);
  });

  buildCtx.dirsDeleted.forEach((dirDeleted) => {
    compilerCtx.fs.clearDirCache(dirDeleted);
  });
};

export const isWatchIgnorePath = (config: d.Config, path: string) => {
  if (isString(path)) {
    const isWatchIgnore = (config.watchIgnoredRegex as RegExp[]).some((reg) => reg.test(path));
    if (isWatchIgnore) {
      return true;
    }
    const outputTargets = config.outputTargets;
    const ignoreFiles = [
      ...outputTargets.filter(isOutputTargetDocsJson).map((o) => o.file),
      ...outputTargets.filter(isOutputTargetDocsJson).map((o) => o.typesFile),
      ...outputTargets.filter(isOutputTargetStats).map((o) => o.file),
      ...outputTargets.filter(isOutputTargetDocsVscode).map((o) => o.file),
    ];
    if (ignoreFiles.includes(path)) {
      return true;
    }
  }
  return false;
};
