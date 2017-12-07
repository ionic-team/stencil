import { BuildConfig, BuildContext, CopyTask } from '../../util/interfaces';
import { catchError, ensureDirectoriesExist, normalizePath } from '../util';


export function copyTasks(config: BuildConfig, ctx: BuildContext) {
  if (!config.copy) {
    config.logger.debug(`copy tasks disabled`);
    return Promise.resolve();
  }

  if (!config.generateWWW) {
    return Promise.resolve();
  }

  const timeSpan = config.logger.createTimeSpan(`copyTasks started`, true);
  const allCopyTasks: CopyTask[] = [];

  const copyTasks = Object.keys(config.copy).map(copyTaskName => config.copy[copyTaskName]);

  return Promise.all(copyTasks.map(copyTask => {
    return processCopyTasks(config, allCopyTasks, copyTask);

  })).then(() => {
    const ensureDirectories: string[] = [];

    allCopyTasks.forEach(ct => {
      const dest = ct.isDirectory ? ct.dest : config.sys.path.dirname(ct.dest);
      if (ensureDirectories.indexOf(dest) === -1) {
        ensureDirectories.push(dest);
      }
    });

    return ensureDirectoriesExist(config.sys, ensureDirectories, [config.rootDir]);

  }).then(() => {
    return Promise.all(allCopyTasks.map(copyTask => {
      return config.sys.copy(copyTask.src, copyTask.dest, { filter: copyTask.filter });
    }));

  }).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    timeSpan.finish(`copyTasks finished`);
  });
}


export function processCopyTasks(config: BuildConfig, allCopyTasks: CopyTask[], copyTask: CopyTask): Promise<any> {
  if (!copyTask) {
    // possible null was set, which is fine, just skip over this one
    return Promise.resolve(null);
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

  return new Promise(resolve => {
    config.sys.fs.stat(processedCopyTask.src, (err, stats) => {
      if (err) {
        if (copyTask.warn !== false) {
          config.logger.warn(`copy, ${processedCopyTask.src}: ${err}`);
        }
        resolve();

      } else {
        processedCopyTask.isDirectory = stats.isDirectory();
        config.logger.debug(`copy, ${processedCopyTask.src} to ${processedCopyTask.dest}, isDirectory: ${processedCopyTask.isDirectory}`);
        allCopyTasks.push(processedCopyTask);
        resolve();
      }
    });
  });
}


function processGlob(config: BuildConfig, copyTask: CopyTask) {
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


export function getGlobCopyTask(config: BuildConfig, copyTask: CopyTask, globRelPath: string) {
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


export function processCopyTask(config: BuildConfig, copyTask: CopyTask) {
  const processedCopyTask: CopyTask = {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(config, copyTask.src, copyTask.dest),
    filter: copyTask.filter
  };

  return processedCopyTask;
}


export function getSrcAbsPath(config: BuildConfig, src: string) {
  if (config.sys.path.isAbsolute(src)) {
    return src;
  }

  return config.sys.path.join(config.srcDir, src);
}


export function getDestAbsPath(config: BuildConfig, src: string, dest?: string) {
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


export function isCopyTaskFile(config: BuildConfig, filePath: string) {
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

      var relPath = config.sys.path.relative(copySrc, filePath);

      if (!relPath.startsWith('.')) {
        return true;
      }
    }
  }

  return false;
}
