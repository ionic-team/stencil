import { BuildConfig } from '../util/interfaces';
import { BuildContext } from './interfaces';
import { build } from './build';
import { isDevFile, isTsSourceFile, isSassSourceFile, isCssSourceFile, normalizePath } from './util';


export function setupWatcher(buildConfig: BuildConfig, ctx: BuildContext) {
  // only create the watcher if this is a watch build
  // and we haven't created a watcher yet
  if (!buildConfig.watch || ctx.watcher) return;

  const logger = buildConfig.logger;
  let queueChangeBuild = false;
  let queueFullBuild = false;

  ctx.watcher = buildConfig.sys.watch(buildConfig.src, {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true
  });

  ctx.watcher
    .on('change', (path: string) => {
      logger.debug(`watcher, change: ${path}, ${Date.now()}`);

      if (isDevFile(path)) {
        // queue change
        queueChangeBuild = true;
        queue(path);
      }
    })
    .on('unlink', (path: string) => {
      logger.debug(`watcher, unlink: ${path}, ${Date.now()}`);

      if (isDevFile(path)) {
        // queue change since we already knew about this file
        queueFullBuild = true;
        queue();
      }
    })
    .on('add', (path: string) => {
      logger.debug(`watcher, add: ${path}, ${Date.now()}`);

      if (isDevFile(path)) {
        // new dev file was added
        // do a full rebuild to get the details
        queueFullBuild = true;
        queue();
      }
    })
    .on('addDir', (path: string) => {
      logger.debug(`watcher, addDir: ${path}, ${Date.now()}`);

      // no clue what's up, do a full rebuild
      queueFullBuild = true;
      queue();
    })
    .on('unlinkDir', (path: string) => {
      logger.debug(`watcher, unlinkDir: ${path}, ${Date.now()}`);

      // no clue what's up, do a full rebuild
      queueFullBuild = true;
      queue();
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
          watchBuild(buildConfig, ctx, true, changedFileCopies);

        } else if (queueChangeBuild) {
          watchBuild(buildConfig, ctx, false, changedFileCopies);
        }

        // reset
        queueFullBuild = queueChangeBuild = false;

      } catch (e) {
        logger.error(e.toString());
      }

    }, 50);
  }
}


function watchBuild(buildConfig: BuildConfig, ctx: BuildContext, requiresFullBuild: boolean, changedFiles: string[]) {
  // always set to full build
  ctx.isRebuild = true;
  ctx.isChangeBuild = false;
  ctx.changeHasComponentModules = true;
  ctx.changeHasNonComponentModules = true;
  ctx.changeHasSass = true;
  ctx.changeHasCss = true;
  ctx.changedFiles = changedFiles;

  if (!requiresFullBuild && changedFiles.length) {
    let changeHasComponentModules = false;
    let changeHasNonComponentModules = false;
    ctx.changeHasSass = false;
    ctx.changeHasCss = false;

    changedFiles.forEach(changedFile => {

      if (isTsSourceFile(changedFile)) {
        // we know there's a module change
        const moduleFile = ctx.moduleFiles[changedFile];
        if (moduleFile && moduleFile.hasCmpClass) {
          // we've got a module file already in memory and
          // the changed file we already know is a component file
          changeHasComponentModules = true;

          // remove its cached content
          delete ctx.moduleFiles[changedFile];

        } else {
          // not in cache, so let's consider it a module change
          changeHasNonComponentModules = true;
        }

      } else if (isSassSourceFile(changedFile)) {
        // we know there's a sass change
        ctx.changeHasSass = true;

      } else if (isCssSourceFile(changedFile)) {
        // we know there's a css change
        ctx.changeHasCss = true;
      }
    });

    // if nothing is true then something is up
    // so let's do a full build if "isChangeBuild" is false
    ctx.isChangeBuild = (changeHasComponentModules || changeHasNonComponentModules || ctx.changeHasSass || ctx.changeHasCss);

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
    ctx.moduleBundleOutputs = {};
    ctx.styleSassOutputs = {};
  }

  return build(buildConfig, ctx);
}
