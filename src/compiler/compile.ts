import { BuildConfig, BuildContext, CompileResults } from './interfaces';
import { catchError } from './util';
import { generateManifest } from './manifest';
import { isTsSourceFile, readFile, normalizePath } from './util';
import { transpile } from './transpile';


export function compileSrcDir(buildConfig: BuildConfig, ctx: BuildContext) {
  const logger = buildConfig.logger;

  const timeSpan = buildConfig.logger.createTimeSpan(`compile started`);

  logger.debug(`compileDirectory, srcDir: ${buildConfig.src}`);

  const compileResults: CompileResults = {
    moduleFiles: {},
    diagnostics: [],
    manifest: {},
    includedSassFiles: []
  };

  return compileDir(buildConfig, ctx, buildConfig.src, compileResults).then(() => {
    compileResults.manifest = generateManifest(buildConfig, ctx, compileResults);

  }).then(() => {
    return copySourceSassFilesToDest(buildConfig, ctx, compileResults);

  }).catch(err => {
    catchError(compileResults.diagnostics, err);

  }).then(() => {
    timeSpan.finish(`compile finished`);
    return compileResults;
  });
}


function compileDir(buildConfig: BuildConfig, ctx: BuildContext, dir: string, compileResults: CompileResults): Promise<any> {
  return new Promise(resolve => {
    // loop through this directory and sub directories looking for
    // files that need to be transpiled
    const sys = buildConfig.sys;
    const logger = buildConfig.logger;

    dir = normalizePath(dir);

    logger.debug(`compileDirectory: ${dir}`);

    sys.fs.readdir(dir, (err, files) => {
      if (err) {
        resolve();
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(dirItem => {
        // let's loop through each of the files we've found so far
        const readPath = sys.path.join(dir, dirItem);

        if (!isValidDirectory(buildConfig.exclude, readPath)) {
          // don't bother continuing for invalid directories
          return;
        }

        promises.push(new Promise(resolve => {

          sys.fs.stat(readPath, (err, stats) => {
            if (err) {
              // derp, not sure what's up here, let's just print out the error
              catchError(compileResults.diagnostics, err);
              resolve();

            } else if (stats.isDirectory()) {
              // looks like it's yet another directory
              // let's keep drilling down
              compileDir(buildConfig, ctx, readPath, compileResults).then(() => {
                resolve();
              });

            } else if (stats.isFile() && isTsSourceFile(readPath)) {
              // woot! we found a typescript file that needs to be transpiled
              // let's send this over to our worker manager who can
              // then assign a worker to this exact file
              compileFile(buildConfig, ctx, readPath, compileResults).then(() => {
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


function compileFile(buildConfig: BuildConfig, ctx: BuildContext, filePath: string, compileResults: CompileResults) {
  return Promise.resolve().then(() => {

    const normalizedFilePath = normalizePath(filePath);
    return transpile(buildConfig, ctx, normalizedFilePath).then(transpileResults => {
      if (transpileResults.diagnostics) {
        compileResults.diagnostics = compileResults.diagnostics.concat(transpileResults.diagnostics);
      }
      if (transpileResults.moduleFiles) {
        Object.keys(transpileResults.moduleFiles).forEach(path => {
          const normalizedTsFilePath = normalizePath(path);
          const moduleFile = transpileResults.moduleFiles[normalizedTsFilePath];

          compileResults.moduleFiles[normalizedTsFilePath] = moduleFile;

          if (buildConfig.generateCollection) {
            ctx.filesToWrite[moduleFile.jsFilePath] = moduleFile.jsText;
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
      return compileResults;
    });
  });
}


function copySourceSassFilesToDest(buildConfig: BuildConfig, ctx: BuildContext, compileResults: CompileResults): Promise<any> {
  if (!buildConfig.generateCollection) {
    return Promise.resolve();
  }

  const sys = buildConfig.sys;

  return Promise.all(compileResults.includedSassFiles.map(sassSrcPath => {
    sassSrcPath = normalizePath(sassSrcPath);

    return readFile(sys, sassSrcPath).then(sassSrcText => {
      const includeDir = sassSrcPath.indexOf(buildConfig.src) === 0;
      let sassDestPath: string;

      if (includeDir) {
        sassDestPath = normalizePath(sys.path.join(
          buildConfig.collectionDest,
          sys.path.relative(buildConfig.src, sassSrcPath)
        ));

      } else {
        sassDestPath = normalizePath(sys.path.join(
          buildConfig.rootDir,
          sys.path.relative(buildConfig.rootDir, sassSrcPath)
        ));
      }

      ctx.filesToWrite[sassDestPath] = sassSrcText;
    });
  }));
}


function isValidDirectory(exclude: string[], filePath: string) {
  for (var i = 0; i < exclude.length; i++) {
    if (filePath.indexOf(exclude[i]) > -1) {
      return false;
    }
  }
  return true;
}
