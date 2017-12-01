import { BuildConfig, BuildContext, CompileResults } from '../../util/interfaces';
import { catchError, hasError, readFile, normalizePath } from '../util';
import { getModuleFile } from '../transpile/compiler-host';
import { transpileFiles } from '../transpile/transpile';


export function compileSrcDir(config: BuildConfig, ctx: BuildContext) {
  const logger = config.logger;

  const compileResults: CompileResults = {
    moduleFiles: {},
    includedSassFiles: []
  };

  if (hasError(ctx.diagnostics)) {
    return Promise.resolve(compileResults);
  }

  const timeSpan = config.logger.createTimeSpan(`compile started`);

  logger.debug(`compileDirectory, srcDir: ${config.srcDir}`);

  return scanDir(config, ctx, config.srcDir, compileResults).then(() => {
    return transpileFiles(config, ctx, compileResults.moduleFiles);

  }).then(transpileResults => {
    if (transpileResults.moduleFiles) {
      Object.keys(transpileResults.moduleFiles).forEach(tsFilePath => {
        const moduleFile = transpileResults.moduleFiles[tsFilePath];

        compileResults.moduleFiles[tsFilePath] = moduleFile;

        if (config.generateDistribution && typeof ctx.jsFiles[moduleFile.jsFilePath] === 'string') {
          ctx.filesToWrite[moduleFile.jsFilePath] = ctx.jsFiles[moduleFile.jsFilePath];
        }

        if (moduleFile.includedSassFiles) {
          moduleFile.includedSassFiles.forEach(includedSassFile => {
            if (compileResults.includedSassFiles.indexOf(includedSassFile) === -1) {
              compileResults.includedSassFiles.push(includedSassFile);
            }
          });
        }
      });
    }

  }).then(() => {
    return copySourceSassFilesToDest(config, ctx, compileResults);

  }).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    timeSpan.finish(`compile finished`);
    return compileResults;
  });
}


function scanDir(config: BuildConfig, ctx: BuildContext, dir: string, compileResults: CompileResults): Promise<any> {
  return new Promise(resolve => {
    // loop through this directory and sub directories looking for
    // files that need to be transpiled
    const sys = config.sys;

    dir = normalizePath(dir);

    sys.fs.readdir(dir, (err, files) => {
      if (err) {
        resolve();
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(dirItem => {
        // let's loop through each of the files we've found so far
        const readPath = sys.path.join(dir, dirItem);

        promises.push(new Promise(resolve => {

          sys.fs.stat(readPath, (err, stats) => {
            if (err) {
              // derp, not sure what's up here, let's just print out the error
              catchError(ctx.diagnostics, err);
              resolve();

            } else if (stats.isDirectory()) {
              // looks like it's yet another directory
              // let's keep drilling down
              scanDir(config, ctx, readPath, compileResults).then(() => {
                resolve();
              });

            } else if (isIncludePath(config, readPath)) {
              // woot! we found a typescript file that needs to be transpiled
              // let's send this over to our worker manager who can
              // then assign a worker to this exact file
              getModuleFile(config, ctx, readPath).then(moduleFile => {
                compileResults.moduleFiles[moduleFile.tsFilePath] = moduleFile;
                resolve();
              });

            } else {
              // idk, don't care, just resolve
              resolve();
            }
          });

        }));

      });

      Promise.all(promises).then(() => {
        // cool, all the recursive scan directories have finished
        // let this resolve and start bubbling up the resolves
        resolve();
      });
    });

  });
}


export function isIncludePath(config: BuildConfig, readPath: string) {
  for (var i = 0; i < config.excludeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.excludeSrc[i])) {
      return false;
    }
  }

  for (i = 0; i < config.includeSrc.length; i++) {
    if (config.sys.minimatch(readPath, config.includeSrc[i])) {
      return true;
    }
  }

  return false;
}


function copySourceSassFilesToDest(config: BuildConfig, ctx: BuildContext, compileResults: CompileResults): Promise<any> {
  if (!config.generateDistribution) {
    return Promise.resolve();
  }

  const sys = config.sys;

  return Promise.all(compileResults.includedSassFiles.map(sassSrcPath => {
    sassSrcPath = normalizePath(sassSrcPath);

    return readFile(sys, sassSrcPath).then(sassSrcText => {
      const includeDir = sassSrcPath.indexOf(config.srcDir) === 0;
      let sassDestPath: string;

      if (includeDir) {
        sassDestPath = normalizePath(sys.path.join(
          config.collectionDir,
          sys.path.relative(config.srcDir, sassSrcPath)
        ));

      } else {
        sassDestPath = normalizePath(sys.path.join(
          config.rootDir,
          sys.path.relative(config.rootDir, sassSrcPath)
        ));
      }

      ctx.filesToWrite[sassDestPath] = sassSrcText;
    });
  }));
}
