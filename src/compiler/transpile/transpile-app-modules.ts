import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { catchError } from '../util';
import { InMemoryFileSystem } from '../../util/in-memory-fs';
import { transpileModules } from '../transpile/transpile';


export async function transpileAppModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if (canSkipTranspiling(config, buildCtx)) {
    // this is a rebuild, but turns out the files causing to
    // do not require us to run the transpiling again
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`compile started`);

  try {
    // recursively scan all of the src directories
    // looking for typescript files to transpile
    // and read the files async and put into our
    // in-memory file system
    const tsFilePaths = await scanDirForTsFiles(config, compilerCtx.fs, config.srcDir);

    // found all the files we need to transpile
    // and have all the files in-memory and ready to go
    // go ahead and kick off transpiling
    await transpileModules(config, compilerCtx, buildCtx, tsFilePaths);

  } catch (e) {
    // gah!!
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`compile finished`);
}


async function scanDirForTsFiles(config: Config, fs: InMemoryFileSystem, dir: string): Promise<any> {
  const scanDirTimeSpan = config.logger.createTimeSpan(`scan ${config.srcDir} for ts files started`, true);

  // loop through this directory and sub directories looking for
  // files that need to be transpiled
  const dirItems = await fs.readdir(dir, { recursive: true });

  // filter down to only the ts files we should include
  const tsFileItems = dirItems.filter(item => {
    return item.isFile && isFileIncludePath(config, item.absPath);
  });

  // let's async read and cache the source file so it get's loaded up
  // into our in-memory file system to be used later during the actual transpile
  await Promise.all(tsFileItems.map(async tsFileItem => {
    await fs.readFile(tsFileItem.absPath);
  }));

  scanDirTimeSpan.finish(`scan for ts files finished`);

  // return just the abs path
  return tsFileItems.map(tsFileItem => tsFileItem.absPath);
}


function canSkipTranspiling(config: Config, buildCtx: BuildCtx) {
  if (buildCtx.requiresFullBuild) {
    // requires a full rebuild, so we cannot skip transpiling
    return false;
  }

  if (buildCtx.dirsAdded.length > 0 || buildCtx.dirsDeleted.length > 0) {
    // if a directory was added or deleted
    // then we cannot skip transpiling
    return false;
  }

  const isTsFileInChangedFiles = buildCtx.filesChanged.some(filePath => {
    // do transpiling if one of the changed files is a ts file
    // and the changed file is not the components.d.ts file
    // when the components.d.ts file is written to disk it shouldn't cause a new build
    return isFileIncludePath(config, filePath);
  });

  // we can skip transpiling if there are no ts files that have changed
  return !isTsFileInChangedFiles;
}


export function isFileIncludePath(config: Config, readPath: string) {
  for (var i = 0; i < config.excludeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.excludeSrc[i])) {
      // this file is a file we want to exclude
      return false;
    }
  }

  for (i = 0; i < config.includeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.includeSrc[i])) {
      // this file is a file we want to include
      return true;
    }
  }

  // not a file we want to include, let's not add it
  return false;
}
