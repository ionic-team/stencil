import { BuildCtx, Config, CompilerCtx, CopyTask } from '../../util/interfaces';
import { catchError, normalizePath } from '../util';


export async function copyTasks(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if (!config.copy) {
    config.logger.debug(`copy tasks disabled`);
    return;
  }

  if (!config.generateWWW) {
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`copyTasks started`, true);
  const allCopyTasks: CopyTask[] = [];

  const copyTasks = Object.keys(config.copy).map(copyTaskName => config.copy[copyTaskName]);

  try {
    await Promise.all(copyTasks.map(copyTask => {
      return processCopyTasks(config, compilerCtx, allCopyTasks, copyTask);
    }));

    await Promise.all(allCopyTasks.map(async copyTask => {
      await compilerCtx.fs.copy(copyTask.src, copyTask.dest, { filter: copyTask.filter });
    }));

    await compilerCtx.fs.commitCopy();

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`copyTasks finished`);
}


export async function processCopyTasks(config: Config, ctx: CompilerCtx, allCopyTasks: CopyTask[], copyTask: CopyTask): Promise<any> {
  if (!copyTask) {
    // possible null was set, which is fine, just skip over this one
    return null;
  }

  if (!copyTask.src) {
    throw new Error(`copy missing "src" property`);
  }

  if (copyTask.dest && config.sys.isGlob(copyTask.dest)) {
    throw new Error(`copy "dest" property cannot be a glob: ${copyTask.dest}`);
  }

  if (config.sys.isGlob(copyTask.src)) {
    return processGlob(config, copyTask).then(copyTasks => {
      allCopyTasks.push(...copyTasks);
    });
  }

  const processedCopyTask = processCopyTask(config, copyTask);

  try {
    const stats = await ctx.fs.stat(processedCopyTask.src);
    processedCopyTask.isDirectory = stats.isDirectory;
    config.logger.debug(`copy, ${processedCopyTask.src} to ${processedCopyTask.dest}, isDirectory: ${processedCopyTask.isDirectory}`);
    allCopyTasks.push(processedCopyTask);

  } catch (e) {
    if (copyTask.warn !== false) {
      config.logger.warn(`copy, ${processedCopyTask.src}: ${e}`);
    }
  }
}


function processGlob(config: Config, copyTask: CopyTask) {
  const globOpts = {
    cwd: config.srcDir,
    nodir: true
  };

  return config.sys.glob(copyTask.src, globOpts).then(files => {
    return files.map(globRelPath => {
      return getGlobCopyTask(config, copyTask, globRelPath);
    });
  });
}


export function getGlobCopyTask(config: Config, copyTask: CopyTask, globRelPath: string) {
  let dest: string;

  if (copyTask.dest) {
    if (config.sys.path.isAbsolute(copyTask.dest)) {
      dest = config.sys.path.join(copyTask.dest, config.sys.path.basename(globRelPath));

    } else {
      dest = config.sys.path.join(config.wwwDir, copyTask.dest, config.sys.path.basename(globRelPath));
    }

  } else {
    dest = config.sys.path.join(config.wwwDir, globRelPath);
  }

  const processedCopyTask: CopyTask = {
    src: config.sys.path.join(config.srcDir, globRelPath),
    dest: dest,
    filter: copyTask.filter
  };

  return processedCopyTask;
}


export function processCopyTask(config: Config, copyTask: CopyTask) {
  const processedCopyTask: CopyTask = {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(config, copyTask.src, copyTask.dest),
    filter: copyTask.filter
  };

  return processedCopyTask;
}


export function getSrcAbsPath(config: Config, src: string) {
  if (config.sys.path.isAbsolute(src)) {
    return src;
  }

  return config.sys.path.join(config.srcDir, src);
}


export function getDestAbsPath(config: Config, src: string, dest?: string) {
  if (dest) {
    if (config.sys.path.isAbsolute(dest)) {
      return dest;

    } else {
      return config.sys.path.join(config.wwwDir, dest);
    }
  }

  if (config.sys.path.isAbsolute(src)) {
    throw new Error(`copy task, "to" property must exist if "from" property is an absolute path: ${src}`);
  }

  return config.sys.path.join(config.wwwDir, src);
}


export function isCopyTaskFile(config: Config, filePath: string) {
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
