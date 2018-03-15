import * as d from '../../declarations';
import { catchError, normalizePath } from '../util';


export async function copyTasks(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], commit: boolean) {
  if (!config.copy) {
    config.logger.debug(`copy tasks disabled`);
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`copy task started`, true);

  try {
    const allCopyTasks: d.CopyTask[] = [];

    const copyTasks = Object.keys(config.copy).map(copyTaskName => config.copy[copyTaskName]);

    await Promise.all(copyTasks.map(async copyTask => {
      await processCopyTasks(config, compilerCtx, allCopyTasks, copyTask);
    }));

    await Promise.all(allCopyTasks.map(async copyTask => {
      await compilerCtx.fs.copy(copyTask.src, copyTask.dest, { filter: copyTask.filter });
    }));

    if (commit && allCopyTasks.length > 0) {
      config.logger.debug(`copy task commit, tasks: ${allCopyTasks.length}`);
      await compilerCtx.fs.commit();
    }

  } catch (e) {
    catchError(diagnostics, e);
  }

  timeSpan.finish(`copy task finished`);
}


export async function processCopyTasks(config: d.Config, compilerCtx: d.CompilerCtx, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask): Promise<any> {
  if (!copyTask) {
    // possible null was set, which is fine, just skip over this one
    return;
  }

  if (!copyTask.src) {
    throw new Error(`copy missing "src" property`);
  }

  if (copyTask.dest && config.sys.isGlob(copyTask.dest)) {
    throw new Error(`copy "dest" property cannot be a glob: ${copyTask.dest}`);
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(outputTarget => {
    return outputTarget.type === 'www' || outputTarget.type === 'dist';
  });

  if (config.sys.isGlob(copyTask.src)) {

    const copyTasks = await processGlob(config, outputTargets, copyTask);
    allCopyTasks.push(...copyTasks);
    return;
  }

  return Promise.all(outputTargets.map(outputTarget => {
    if (outputTarget.collectionDir) {
      return processCopyTaskDestDir(config, compilerCtx, allCopyTasks, copyTask, outputTarget.collectionDir);

    } else {
      return processCopyTaskDestDir(config, compilerCtx, allCopyTasks, copyTask, outputTarget.dir);
    }
  }));
}


async function processCopyTaskDestDir(config: d.Config, compilerCtx: d.CompilerCtx, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask, destAbsDir: string) {
  const processedCopyTask = processCopyTask(config, copyTask, destAbsDir);

  try {
    const stats = await compilerCtx.fs.stat(processedCopyTask.src);
    processedCopyTask.isDirectory = stats.isDirectory;
    config.logger.debug(`copy, ${processedCopyTask.src} to ${processedCopyTask.dest}, isDirectory: ${processedCopyTask.isDirectory}`);
    allCopyTasks.push(processedCopyTask);

  } catch (e) {
    if (copyTask.warn !== false) {
      config.logger.warn(`copy, ${processedCopyTask.src}: ${e}`);
    }
  }
}


async function processGlob(config: d.Config, outputTargets: d.OutputTargetDist[], copyTask: d.CopyTask) {
  const globCopyTasks: d.CopyTask[] = [];

  const globOpts = {
    cwd: config.srcDir,
    nodir: true
  };

  const files = await config.sys.glob(copyTask.src, globOpts);

  files.forEach(globRelPath => {

    outputTargets.forEach(outputTarget => {
      if (outputTarget.collectionDir) {
        globCopyTasks.push(createGlobCopyTask(config, copyTask, outputTarget.collectionDir, globRelPath));

      } else {
        globCopyTasks.push(createGlobCopyTask(config, copyTask, outputTarget.dir, globRelPath));
      }
    });

  });

  return globCopyTasks;
}


export function createGlobCopyTask(config: d.Config, copyTask: d.CopyTask, destDir: string, globRelPath: string) {
  const processedCopyTask: d.CopyTask = {
    src: config.sys.path.join(config.srcDir, globRelPath),
    filter: copyTask.filter
  };

  if (copyTask.dest) {
    if (config.sys.path.isAbsolute(copyTask.dest)) {
      processedCopyTask.dest = config.sys.path.join(copyTask.dest, config.sys.path.basename(globRelPath));

    } else {
      processedCopyTask.dest = config.sys.path.join(destDir, copyTask.dest, config.sys.path.basename(globRelPath));
    }

  } else {
    processedCopyTask.dest = config.sys.path.join(destDir, globRelPath);
  }

  return processedCopyTask;
}


export function processCopyTask(config: d.Config, copyTask: d.CopyTask, destAbsPath: string) {
  const processedCopyTask: d.CopyTask = {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(config, copyTask.src, destAbsPath, copyTask.dest),
    filter: copyTask.filter
  };

  return processedCopyTask;
}


export function getSrcAbsPath(config: d.Config, src: string) {
  if (config.sys.path.isAbsolute(src)) {
    return src;
  }

  return config.sys.path.join(config.srcDir, src);
}


export function getDestAbsPath(config: d.Config, src: string, destAbsPath: string, destRelPath: string) {
  if (destRelPath) {
    if (config.sys.path.isAbsolute(destRelPath)) {
      return destRelPath;

    } else {
      return config.sys.path.join(destAbsPath, destRelPath);
    }
  }

  if (config.sys.path.isAbsolute(src)) {
    throw new Error(`copy task, "to" property must exist if "from" property is an absolute path: ${src}`);
  }

  return config.sys.path.join(destAbsPath, src);
}


export function isCopyTaskFile(config: d.Config, filePath: string) {
  if (!config.copy) {
    // there is no copy config
    return false;
  }

  const copyTaskNames = Object.keys(config.copy);
  if (!copyTaskNames.length) {
    // there are no copy tasks
    return false;
  }

  filePath = normalizePath(filePath);

  // go through all the copy tasks and see if this path matches
  for (var i = 0; i < copyTaskNames.length; i++) {
    var copySrc = config.copy[copyTaskNames[i]].src;

    if (config.sys.isGlob(copySrc)) {
      // test the glob
      copySrc = config.sys.path.join(config.srcDir, copySrc);
      if (config.sys.minimatch(filePath, copySrc)) {
        return true;
      }

    } else {
      copySrc = normalizePath(getSrcAbsPath(config, copySrc));

      if (!config.sys.path.relative(copySrc, filePath).startsWith('.')) {
        return true;
      }
    }
  }

  return false;
}
