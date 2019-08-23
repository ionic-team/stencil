import * as d from '../../declarations';
import { configFileReload } from '../config/config-reload';
import { unique } from '@utils';



export function filesChanged(buildCtx: d.BuildCtx) {
  // files changed include updated, added and deleted
  return unique([
    ...buildCtx.filesUpdated,
    ...buildCtx.filesAdded,
    ...buildCtx.filesDeleted
  ]).sort();
}


export function scriptsAdded(config: d.Config, buildCtx: d.BuildCtx) {
  // collect all the scripts that were added
  return buildCtx.filesAdded.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => config.sys.path.basename(f));
}


export function scriptsDeleted(config: d.Config, buildCtx: d.BuildCtx) {
  // collect all the scripts that were deleted
  return buildCtx.filesDeleted.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => config.sys.path.basename(f));
}


export function hasScriptChanges(buildCtx: d.BuildCtx) {
  return buildCtx.filesChanged.some(f => {
    const ext = getExt(f);
    return SCRIPT_EXT.includes(ext);
  });
}


export function hasStyleChanges(buildCtx: d.BuildCtx) {
  return buildCtx.filesChanged.some(f => {
    const ext = getExt(f);
    return STYLE_EXT.includes(ext);
  });
}


function getExt(filePath: string) {
  return filePath.split('.').pop().toLowerCase();
}


export function isScriptExt(ext: string) {
  return SCRIPT_EXT.includes(ext);
}
const SCRIPT_EXT = ['ts', 'tsx', 'js', 'jsx'];


export function isStyleExt(ext: string) {
  return STYLE_EXT.includes(ext);
}
const STYLE_EXT = ['css', 'scss', 'sass', 'pcss', 'styl', 'stylus', 'less'];


export function hasHtmlChanges(config: d.Config, buildCtx: d.BuildCtx) {
  const anyHtmlChanged = buildCtx.filesChanged.some(f => f.toLowerCase().endsWith('.html'));

  if (anyHtmlChanged) {
    // any *.html in any directory that changes counts and rebuilds
    return true;
  }

  const srcIndexHtmlChanged = buildCtx.filesChanged.some(fileChanged => {
    // the src index index.html file has changed
    // this file name could be something other than index.html
    return fileChanged === config.srcIndexHtml;
  });

  return srcIndexHtmlChanged;
}


export function checkForConfigUpdates(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // figure out if one of the changed files is the config
  if (buildCtx.filesChanged.some(f => f === config.configPath)) {
    buildCtx.debug(`reload config file: ${config.sys.path.relative(config.rootDir, config.configPath)}`);
    configFileReload(config, compilerCtx);
    buildCtx.requiresFullBuild = true;
  }
}


export function updateCacheFromRebuild(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  buildCtx.filesChanged.forEach(filePath => {
    compilerCtx.fs.clearFileCache(filePath);
  });

  buildCtx.dirsAdded.forEach(dirAdded => {
    compilerCtx.fs.clearDirCache(dirAdded);
  });

  buildCtx.dirsDeleted.forEach(dirDeleted => {
    compilerCtx.fs.clearDirCache(dirDeleted);
  });
}
