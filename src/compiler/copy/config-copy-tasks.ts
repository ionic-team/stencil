import * as d from '../../declarations';
import { buildError, normalizePath } from '../util';


export async function getConfigCopyTasks(config: d.Config, buildCtx: d.BuildCtx) {
  const copyTasks: d.CopyTask[] = [];

  if (!Array.isArray(config.copy)) {
    return copyTasks;
  }

  if (buildCtx.isRebuild && !buildCtx.hasCopyChanges) {
    // don't bother copying if this was from a watch change
    // but the change didn't include any copy task files
    return copyTasks;
  }

  try {
    await Promise.all(config.copy.map(async copyTask => {
      await processCopyTasks(config, copyTasks, copyTask);
    }));

  } catch (e) {
    const err = buildError(buildCtx.diagnostics);
    err.messageText = e.message;
  }

  config.logger.debug(`getConfigCopyTasks: ${copyTasks.length}`);

  return copyTasks;
}


export async function processCopyTasks(config: d.Config, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask): Promise<any> {
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
    return outputTarget.appBuild;
  });

  if (config.sys.isGlob(copyTask.src)) {
    const copyTasks = await processGlob(config, outputTargets, copyTask);
    allCopyTasks.push(...copyTasks);
    return;
  }

  await Promise.all(outputTargets.map(async outputTarget => {
    if (outputTarget.collectionDir) {
      await processCopyTaskDestDir(config, allCopyTasks, copyTask, outputTarget.collectionDir);

    } else {
      await processCopyTaskDestDir(config, allCopyTasks, copyTask, outputTarget.dir);
    }
  }));
}


async function processCopyTaskDestDir(config: d.Config, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask, destAbsDir: string) {
  const processedCopyTask: d.CopyTask = {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(config, copyTask.src, destAbsDir, copyTask.dest)
  };
  if (typeof copyTask.warn === 'boolean') {
    processedCopyTask.warn = copyTask.warn;
  }
  allCopyTasks.push(processedCopyTask);
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
  if (!Array.isArray(config.copy)) {
    // there is no copy config
    return false;
  }

  filePath = normalizePath(filePath);

  // go through all the copy tasks and see if this path matches
  for (let i = 0; i < config.copy.length; i++) {
    var copySrc = config.copy[i].src;

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
