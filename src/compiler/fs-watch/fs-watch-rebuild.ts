import type * as d from '../../declarations';
import { basename } from 'path';
import { isString, unique } from '@utils';
import { isOutputTargetDocsJson, isOutputTargetStats, isOutputTargetDocsVscode } from '../output-targets/output-utils';

export const filesChanged = (buildCtx: d.BuildCtx) => {
  // files changed include updated, added and deleted
  return unique([...buildCtx.filesUpdated, ...buildCtx.filesAdded, ...buildCtx.filesDeleted]).sort();
};

export const scriptsAdded = (buildCtx: d.BuildCtx) => {
  // collect all the scripts that were added
  return buildCtx.filesAdded
    .filter((f) => {
      return SCRIPT_EXT.some((ext) => f.endsWith(ext.toLowerCase()));
    })
    .map((f) => basename(f));
};

export const scriptsDeleted = (buildCtx: d.BuildCtx) => {
  // collect all the scripts that were deleted
  return buildCtx.filesDeleted
    .filter((f) => {
      return SCRIPT_EXT.some((ext) => f.endsWith(ext.toLowerCase()));
    })
    .map((f) => basename(f));
};

export const hasScriptChanges = (buildCtx: d.BuildCtx) => {
  return buildCtx.filesChanged.some((f) => {
    const ext = getExt(f);
    return SCRIPT_EXT.includes(ext);
  });
};

export const hasStyleChanges = (buildCtx: d.BuildCtx) => {
  return buildCtx.filesChanged.some((f) => {
    const ext = getExt(f);
    return STYLE_EXT.includes(ext);
  });
};

const getExt = (filePath: string) => filePath.split('.').pop().toLowerCase();

const SCRIPT_EXT = ['ts', 'tsx', 'js', 'jsx'];
export const isScriptExt = (ext: string) => SCRIPT_EXT.includes(ext);

const STYLE_EXT = ['css', 'scss', 'sass', 'pcss', 'styl', 'stylus', 'less'];
export const isStyleExt = (ext: string) => STYLE_EXT.includes(ext);

export const hasHtmlChanges = (config: d.Config, buildCtx: d.BuildCtx) => {
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
