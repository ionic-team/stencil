import * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { configFileReload } from '../config/config-reload';
import { hasServiceWorkerChanges } from '../service-worker/generate-sw';
import { normalizePath, unique } from '@utils';


export function generateBuildFromFsWatch(config: d.Config, compilerCtx: d.CompilerCtx) {
  const buildCtx = new BuildContext(config, compilerCtx);

  // copy watch results over to build ctx data
  // also add in any active build data that
  // hasn't gone though a full build yet
  buildCtx.filesAdded = unique(compilerCtx.activeFilesAdded);
  buildCtx.filesDeleted = unique(compilerCtx.activeFilesDeleted);
  buildCtx.filesUpdated = unique(compilerCtx.activeFilesUpdated);
  buildCtx.dirsAdded = unique(compilerCtx.activeDirsAdded);
  buildCtx.dirsDeleted = unique(compilerCtx.activeDirsDeleted);

  // recursively drill down through any directories added and fill up more data
  buildCtx.dirsAdded.forEach(dirAdded => {
    addDir(config, compilerCtx, buildCtx, dirAdded);
  });

  // files changed include updated, added and deleted
  buildCtx.filesChanged = filesChanged(buildCtx);

  // collect all the scripts that were added/deleted
  buildCtx.scriptsAdded = scriptsAdded(config, buildCtx);
  buildCtx.scriptsDeleted = scriptsDeleted(config, buildCtx);
  buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);

  // collect all the styles that were added/deleted
  buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);

  // figure out if any changed files were index.html files
  buildCtx.hasHtmlChanges = hasHtmlChanges(config, buildCtx);

  buildCtx.hasServiceWorkerChanges = hasServiceWorkerChanges(config, buildCtx);

  // we've got watch results, which means this is a rebuild!!
  buildCtx.isRebuild = true;

  // always require a full rebuild if we've never had a successful build
  buildCtx.requiresFullBuild = !compilerCtx.hasSuccessfulBuild;

  // figure out if one of the changed files is the config
  checkForConfigUpdates(config, compilerCtx, buildCtx);

  // return our new build context that'll be used for the next build
  return buildCtx;
}

function addDir(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, dir: string) {
  dir = normalizePath(dir);

  if (!buildCtx.dirsAdded.includes(dir)) {
    buildCtx.dirsAdded.push(dir);
  }

  const items = compilerCtx.fs.disk.readdirSync(dir);

  items.forEach(dirItem => {
    const itemPath = normalizePath(config.sys.path.join(dir, dirItem));
    const stat = compilerCtx.fs.disk.statSync(itemPath);

    if (stat.isDirectory()) {
      addDir(config, compilerCtx, buildCtx, itemPath);

    } else if (stat.isFile()) {
      if (!buildCtx.filesAdded.includes(itemPath)) {
        buildCtx.filesAdded.push(itemPath);
      }
    }
  });
}


export function filesChanged(buildCtx: d.BuildCtx) {
  // files changed include updated, added and deleted
  return unique([
    ...buildCtx.filesUpdated,
    ...buildCtx.filesAdded,
    ...buildCtx.filesDeleted
  ]).sort();
}


function scriptsAdded(config: d.Config, buildCtx: d.BuildCtx) {
  // collect all the scripts that were added
  return buildCtx.filesAdded.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => config.sys.path.basename(f));
}


function scriptsDeleted(config: d.Config, buildCtx: d.BuildCtx) {
  // collect all the scripts that were deleted
  return buildCtx.filesDeleted.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => config.sys.path.basename(f));
}


function hasScriptChanges(buildCtx: d.BuildCtx) {
  return buildCtx.filesChanged.some(f => {
    const ext = getExt(f);
    return SCRIPT_EXT.includes(ext);
  });
}


function hasStyleChanges(buildCtx: d.BuildCtx) {
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


function hasHtmlChanges(config: d.Config, buildCtx: d.BuildCtx) {
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


function checkForConfigUpdates(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
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
