import { build } from './build';
import { BuildConfig, BuildContext } from '../../util/interfaces';
import { copyTasks, isCopyTaskFile } from './copy-tasks';
import { isCssFile, isHtmlFile, isSassFile, isTsFile, isWebDevFile, normalizePath } from '../util';


export function setupWatcher(config: BuildConfig, ctx: BuildContext) {
  // only create the watcher if this is a watch build
  // and we haven't created a watcher yet
  if (!config.watch || ctx.watcher) return;

  config.logger.debug(`setupWatcher: ${config.srcDir}`);

  const logger = config.logger;
  let queueChangeBuild = false;
  let queueFullBuild = false;

  ctx.watcher = config.sys.watch(config.srcDir, {
    ignored: config.watchIgnoredRegex,
    ignoreInitial: true
  });

  if (config.configPath) {
    config.configPath = normalizePath(config.configPath);
    config.logger.debug(`watch configPath: ${config.configPath}`);
    ctx.watcher.add(config.configPath);
  }

  ctx.watcher
    .on('change', (path: string) => {
      path = normalizePath(path);
      logger.debug(`watcher, change: ${path}, ${Date.now()}`);

      if (path === config.configPath) {
        // the actual stencil config file changed
        // this is a big deal, so do a full rebuild
        configFileReload(config);
        queueFullBuild = true;
        queue();
        return;
      }

      if (isCopyTaskFile(config, path)) {
        startCopyTasks();

      } else if (isWebDevFile(path)) {
        // web dev file was updaed
        // queue change build
        queueChangeBuild = true;
        queue(path);
      }

    })
    .on('unlink', (path: string) => {
      logger.debug(`watcher, unlink: ${path}, ${Date.now()}`);

      if (isCopyTaskFile(config, path)) {
        startCopyTasks();

      } else if (isWebDevFile(path)) {
        // web dev file was delete
        // do a full rebuild
        queueFullBuild = true;
        queue();
      }
    })
    .on('add', (path: string) => {
      logger.debug(`watcher, add: ${path}, ${Date.now()}`);

      if (isCopyTaskFile(config, path)) {
        startCopyTasks();

      } else if (isWebDevFile(path)) {
        // new web dev file was added
        // do a full rebuild
        queueFullBuild = true;
        queue();
      }
    })
    .on('addDir', (path: string) => {
      logger.debug(`watcher, addDir: ${path}, ${Date.now()}`);

      if (isCopyTaskFile(config, path)) {
        startCopyTasks();

      } else {
        // no clue what's up, do a full rebuild
        queueFullBuild = true;
        queue();
      }
    })
    .on('unlinkDir', (path: string) => {
      logger.debug(`watcher, unlinkDir: ${path}, ${Date.now()}`);

      if (isCopyTaskFile(config, path)) {
        startCopyTasks();

      } else {
        // no clue what's up, do a full rebuild
        queueFullBuild = true;
        queue();
      }
    })
    .on('error', (err: any) => {
      logger.error(err);
    });


  let timer: any;
  const changedFiles: string[] = [];

  function queue(path?: string) {
    // debounce builds
    clearTimeout(timer);

    if (path && changedFiles.indexOf(path) === -1) {
      path = normalizePath(path);
      changedFiles.push(path);
    }

    timer = setTimeout(() => {
      try {
        const changedFileCopies = changedFiles.slice();
        changedFiles.length = 0;

        if (queueFullBuild) {
          watchBuild(config, ctx, true, changedFileCopies);

        } else if (queueChangeBuild) {
          watchBuild(config, ctx, false, changedFileCopies);
        }

        // reset
        queueFullBuild = queueChangeBuild = false;

      } catch (e) {
        logger.error(e.toString());
      }

    }, 50);
  }

  var copyTaskTmr: any;
  function startCopyTasks() {
    clearTimeout(copyTaskTmr);

    copyTaskTmr = setTimeout(() => {
      copyTasks(config, ctx);
    }, 80);
  }

}


function watchBuild(config: BuildConfig, ctx: BuildContext, requiresFullBuild: boolean, changedFiles: string[]) {
  // always reset to do a full build
  ctx.isRebuild = true;
  ctx.isChangeBuild = false;
  ctx.changeHasComponentModules = true;
  ctx.changeHasNonComponentModules = true;
  ctx.changeHasSass = true;
  ctx.changeHasCss = true;
  ctx.changedFiles = changedFiles;

  if (!ctx.lastBuildHadError && !requiresFullBuild && changedFiles.length) {
    let changeHasComponentModules = false;
    let changeHasNonComponentModules = false;
    ctx.changeHasSass = false;
    ctx.changeHasCss = false;

    changedFiles.forEach(changedFile => {

      if (isTsFile(changedFile)) {
        // we know there's a module change
        const moduleFile = ctx.moduleFiles[changedFile];
        if (moduleFile && moduleFile.cmpMeta) {
          // we've got a module file already in memory and
          // the changed file we already know is a component file
          changeHasComponentModules = true;

        } else {
          // not in cache, so let's consider it a module change
          changeHasNonComponentModules = true;
        }

        // remove its cached content
        delete ctx.moduleFiles[changedFile];

      } else if (isSassFile(changedFile)) {
        ctx.changeHasSass = true;

      } else if (isCssFile(changedFile)) {
        ctx.changeHasCss = true;

      } else if (isHtmlFile(changedFile)) {
        ctx.changeHasHtml = true;
      }
    });

    // if nothing is true then something is up
    // so let's do a full build if "isChangeBuild" ends up being false
    ctx.isChangeBuild = (changeHasComponentModules || changeHasNonComponentModules || ctx.changeHasSass || ctx.changeHasCss || ctx.changeHasHtml);

    if (ctx.isChangeBuild) {
      if (changeHasNonComponentModules && !changeHasComponentModules) {
        // there are module changes, but the changed modules
        // aren't components, when in doubt do a full rebuild
        ctx.changeHasNonComponentModules = true;
        ctx.changeHasComponentModules = false;

      } else if (!changeHasNonComponentModules && changeHasComponentModules) {
        // only modudle changes are ones that are components
        ctx.changeHasNonComponentModules = false;
        ctx.changeHasComponentModules = true;

      } else if (!changeHasNonComponentModules && !changeHasComponentModules) {
        // no modules were changed at all
        ctx.changeHasComponentModules = false;
        ctx.changeHasNonComponentModules = false;
      }
    }
  }

  if (!ctx.isChangeBuild) {
    // completely clear out the cache
    ctx.moduleFiles = {};
    ctx.jsFiles = {};
    ctx.moduleBundleOutputs = {};
    ctx.moduleBundleLegacyOutputs = {};
  }

  changedFiles.sort();
  const totalChangedFiles = changedFiles.length;

  if (totalChangedFiles > 6) {
    const trimmedChangedFiles = changedFiles.slice(0, 5);
    const otherFilesTotal = totalChangedFiles - trimmedChangedFiles.length;
    let msg = `changed files: ${trimmedChangedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;
    if (otherFilesTotal > 0) {
      msg += `, +${otherFilesTotal} other${otherFilesTotal > 1 ? 's' : ''}`;
    }
    config.logger.info(msg);

  } else if (totalChangedFiles > 1) {
    const msg = `changed files: ${changedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;
    config.logger.info(msg);

  } else if (totalChangedFiles > 0) {
    const msg = `changed file: ${changedFiles.map(f => config.sys.path.basename(f)).join(', ')}`;
    config.logger.info(msg);
  }

  return build(config, ctx);
}


function configFileReload(config: BuildConfig) {
  config.logger.debug(`reload config file: ${config.configPath}`);

  try {
    const updatedConfig = config.sys.loadConfigFile(config.configPath);

    // just update the existing config in place
    // not everything should be overwritten or merged
    // pick and choose what's ok to update
    config._isValidated = false;
    config.buildDir = updatedConfig.buildDir;
    config.distDir = updatedConfig.distDir;
    config.bundles = updatedConfig.bundles;
    config.collectionDir = updatedConfig.collectionDir;
    config.collections = updatedConfig.collections;
    config.includeSrc = updatedConfig.includeSrc;
    config.excludeSrc = updatedConfig.excludeSrc;
    config.generateDistribution = updatedConfig.generateDistribution;
    config.generateWWW = updatedConfig.generateWWW;
    config.globalScript = updatedConfig.globalScript;
    config.globalStyle = updatedConfig.globalStyle;
    config.hashedFileNameLength = updatedConfig.hashedFileNameLength;
    config.hashFileNames = updatedConfig.hashFileNames;
    config.wwwIndexHtml = updatedConfig.wwwIndexHtml;
    config.srcIndexHtml = updatedConfig.srcIndexHtml;
    config.minifyCss = updatedConfig.minifyCss;
    config.minifyJs = updatedConfig.minifyJs;
    config.namespace = updatedConfig.namespace;
    config.preamble = updatedConfig.preamble;
    config.prerender = updatedConfig.prerender;
    config.publicPath = updatedConfig.publicPath;
    config.srcDir = updatedConfig.srcDir;
    config.watchIgnoredRegex = updatedConfig.watchIgnoredRegex;

  } catch (e) {
    config.logger.error(e);
  }
}
