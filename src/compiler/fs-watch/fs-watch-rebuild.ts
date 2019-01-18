import * as d from '@declarations';
import { BuildContext } from '../build/build-ctx';
import { configFileReload } from '../config/config-reload';
import { isCopyTaskFile } from '../copy/config-copy-tasks';
import { hasServiceWorkerChanges, normalizePath, pathJoin } from '@utils';
import { sys } from '@sys';


export function generateBuildFromFsWatch(config: d.Config, compilerCtx: d.CompilerCtx, fsWatchResults: d.FsWatchResults) {
  const buildCtx = new BuildContext(config, compilerCtx);

  // copy watch results over to build ctx data
  buildCtx.filesUpdated.push(...fsWatchResults.filesUpdated);
  buildCtx.filesAdded.push(...fsWatchResults.filesAdded);
  buildCtx.filesDeleted.push(...fsWatchResults.filesDeleted);
  buildCtx.dirsDeleted.push(...fsWatchResults.dirsDeleted);
  buildCtx.dirsAdded.push(...fsWatchResults.dirsAdded);

  // recursively drill down through any directories added and fill up more data
  buildCtx.dirsAdded.forEach(dirAdded => {
    addDir(config, compilerCtx, buildCtx, dirAdded);
  });

  // files changed include updated, added and deleted
  buildCtx.filesChanged = filesChanged(buildCtx);

  // see if any of the changed files/directories are copy tasks
  buildCtx.hasCopyChanges = hasCopyChanges(config, buildCtx);

  // see if we should rebuild or not
  if (!shouldRebuild(buildCtx)) {
    // nothing actually changed!!!
    if (compilerCtx.events) {
      compilerCtx.events.emit('buildNoChange', { noChange: true });
    }
    return null;
  }

  // collect all the scripts that were added/deleted
  buildCtx.scriptsAdded = scriptsAdded(buildCtx);
  buildCtx.scriptsDeleted = scriptsDeleted(buildCtx);
  buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);

  // collect all the styles that were added/deleted
  buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);

  // figure out if any changed files were index.html files
  buildCtx.hasIndexHtmlChanges = hasIndexHtmlChanges(config, buildCtx);

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
    const itemPath = pathJoin(config, dir, dirItem);
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
  return buildCtx.filesUpdated.concat(buildCtx.filesAdded, buildCtx.filesDeleted).reduce((filesChanged, filePath: string) => {
    if (!filesChanged.includes(filePath)) {
      filesChanged.push(filePath);
    }

    return filesChanged;
  }, [] as string[]).sort();
}


function hasCopyChanges(config: d.Config, buildCtx: d.BuildCtx) {
  return buildCtx.filesUpdated.some(f => isCopyTaskFile(config, f)) ||
         buildCtx.filesAdded.some(f => isCopyTaskFile(config, f)) ||
         buildCtx.dirsAdded.some(f => isCopyTaskFile(config, f));
}

export function shouldRebuild(buildCtx: d.BuildCtx) {
  return buildCtx.hasCopyChanges ||
    buildCtx.dirsAdded.length > 0 ||
    buildCtx.dirsDeleted.length > 0 ||
    buildCtx.filesAdded.length > 0 ||
    buildCtx.filesDeleted.length > 0 ||
    buildCtx.filesUpdated.length > 0;
}


function scriptsAdded(buildCtx: d.BuildCtx) {
  // collect all the scripts that were added
  return buildCtx.filesAdded.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => sys.path.basename(f));
}


function scriptsDeleted(buildCtx: d.BuildCtx) {
  // collect all the scripts that were deleted
  return buildCtx.filesDeleted.filter(f => {
    return SCRIPT_EXT.some(ext => f.endsWith(ext.toLowerCase()));
  }).map(f => sys.path.basename(f));
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


function hasIndexHtmlChanges(config: d.Config, buildCtx: d.BuildCtx) {
  const anyIndexHtmlChanged = buildCtx.filesChanged.some(fileChanged => sys.path.basename(fileChanged).toLowerCase() === 'index.html');
  if (anyIndexHtmlChanged) {
    // any index.html in any directory that changes counts too
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
    buildCtx.debug(`reload config file: ${sys.path.relative(config.rootDir, config.configPath)}`);
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
