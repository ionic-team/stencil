import { BuildContext, CompilerConfig, Results } from './interfaces';
import { createFileMeta, getFileMeta, isTsSourceFile, logError, readFile, writeFiles, access } from './util';
import { generateManifest } from './manifest';
import { setupCompilerWatch } from './watch';
import { transpile, transpileFiles } from './transpile';


/**
 * Inputs a source directory of components (.ts/.scss files)
 * and compiles them into reusable ionic components. Output directory
 * contains that transpiled files that are now separate .js files, and
 * copies over all .scss files each component requires. Think
 * typescript's "tsc" command, but for ionic components.
 *
 * This command also creates a manifest.json file, which includes
 * everything 3rd party tooling need to know about each component at
 * "build" time. The manifest.json also includes paths to all the files
 * each component uses, and meta data like modes, properties, etc.
 */
export function compile(config: CompilerConfig, ctx: BuildContext = {}): Promise<Results> {
  validateCompile(config);

  config.logger.debug(`compile, include: ${config.include}`);
  config.logger.debug(`compile, outDir: ${config.compilerOptions.outDir}`);

  if (!ctx.files) {
    ctx.files = new Map();
  }

  ctx.results = {
    files: []
  };

  config.include = config.include || [];

  if (!config.exclude) {
    config.exclude = ['node_modules', 'bower_components'];
  }

  const scanDirPromises = config.include.map(includePath => {
    return scanDirectory(includePath, config, ctx);
  });

  return Promise.all(scanDirPromises)
    .then(() => {
      return transpile(config, ctx);

    }).then(() => {
      return processStyles(config, ctx);

    }).then(() => {
      return generateManifest(config, ctx);

    }).then(() => {
      return setupCompilerWatch(config, ctx, config.sys.typescript.sys);

    }).then(() => {
      config.logger.info('compile, done');
      return ctx.results;

    });
}


export function compileWatch(config: CompilerConfig, ctx: BuildContext, changedFiles: string[]) {
  const scanDirs: string[] = [];
  changedFiles.forEach(filePath => {
    if (isTsSourceFile(filePath)) {
      const dirPath = config.sys.path.dirname(filePath);
      if (scanDirs.indexOf(dirPath) === -1) {
        scanDirs.push(dirPath);
      }
    }
  });

  const scanDirPromises = scanDirs.map(dirPath => {
    return scanDirectory(dirPath, config, ctx);
  });

  return Promise.all(scanDirPromises)
    .then(() => {

      const tsFilesToRetranspile: string[] = [];

      ctx.files.forEach(f => {
        if (f.isTsSourceFile && f.transpiledCount === 0) {
          tsFilesToRetranspile.push(f.filePath);
          f.transpiledCount++;
        }
      });

      return transpileFiles(tsFilesToRetranspile, config, ctx);

    }).then(() => {
      return processStyles(config, ctx);

    }).then(() => {
      return generateManifest(config, ctx);

    }).then(() => {
      return setupCompilerWatch(config, ctx, config.sys.typescript.sys);

    }).then(() => {
      config.logger.info('compile, done');
      return ctx.results;

    });
}


function scanDirectory(dir: string, config: CompilerConfig, ctx: BuildContext): Promise<any> {

  return access(config.sys, dir).then(pathExists => {
    if (!pathExists) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {

      config.logger.debug(`compile, scanDirectory: ${dir}`);

      config.sys.fs.readdir(dir, (err, files) => {
        if (err) {
          logError(ctx.results, err);
          resolve();
          return;
        }

        const promises: Promise<any>[] = [];

        files.forEach(dirItem => {
          const readPath = config.sys.path.join(dir, dirItem);

          if (!isValidDirectory(config, readPath)) {
            return;
          }

          promises.push(new Promise(resolve => {

            config.sys.fs.stat(readPath, (err, stats) => {
              if (err) {
                logError(ctx.results, err);
                resolve();

              } else if (stats.isDirectory()) {
                scanDirectory(readPath, config, ctx).then(() => {
                  resolve();
                });

              } else if (isTsSourceFile(readPath)) {
                getFileMeta(config.sys, ctx, readPath).then(fileMeta => {
                  fileMeta.recompileOnChange = true;

                  if (fileMeta.filePath && fileMeta.hasCmpClass) {
                    if (ctx.results.files.indexOf(fileMeta.filePath) === -1) {
                      ctx.results.files.push(fileMeta.filePath);
                    }
                  }

                  resolve();
                });

              } else {
                resolve();
              }
            });

          }));

        });

        Promise.all(promises).then(() => {
          resolve();
        });
      });

    });
  });

}


function isValidDirectory(config: CompilerConfig, filePath: string) {
  for (var i = 0; i < config.exclude.length; i++) {
    if (filePath.indexOf(config.exclude[i]) > -1) {
      return false;
    }
  }
  return true;
}


function processStyles(config: CompilerConfig, ctx: BuildContext) {
  const destDir = config.compilerOptions.outDir;

  config.logger.debug(`compile, processStyles, destDir ${destDir}`);

  const promises: Promise<any>[] = [];

  const includedSassFiles: string[] = [];

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta || !f.cmpMeta.styleMeta) return;

    const modeNames = Object.keys(f.cmpMeta.styleMeta);

    modeNames.forEach(modeName => {
      const modeMeta = Object.assign({}, f.cmpMeta.styleMeta[modeName]);

      if (modeMeta.styleUrls) {
        modeMeta.styleUrls.forEach(styleUrl => {
          const scssFileName = config.sys.path.basename(styleUrl);
          const scssFilePath = config.sys.path.join(f.srcDir, scssFileName);
          promises.push(getIncludedSassFiles(config, ctx, includedSassFiles, scssFilePath));
        });
      }

    });
  });

  return Promise.all(promises).then(() => {
    const files = new Map<string, string>();
    const promises: Promise<any>[] = [];

    includedSassFiles.forEach(includedSassFile => {

      config.include.forEach(includeDir => {
        if (includedSassFile.indexOf(includeDir) === 0) {
          const src = includedSassFile;
          const relative = includedSassFile.replace(includeDir, '');
          const dest = config.sys.path.join(destDir, relative);

          promises.push(readFile(config.sys, src).then(content => {
            files.set(dest, content);
          }));
        }
      });

    });

    return Promise.all(promises).then(() => {
      return writeFiles(config.sys, files);
    });
  });
}


function getIncludedSassFiles(config: CompilerConfig, ctx: BuildContext, includedSassFiles: string[], scssFilePath: string) {
  return new Promise((resolve, reject) => {

    const sassConfig = {
      file: scssFilePath
    };

    if (ctx.results.files.indexOf(scssFilePath) === -1) {
      ctx.results.files.push(scssFilePath);
    }

    config.logger.debug(`compile, getIncludedSassFiles: ${scssFilePath}`);

    config.sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        logError(ctx.results, err);
        reject(err);

      } else {
        result.stats.includedFiles.forEach((includedFile: string) => {
          if (includedSassFiles.indexOf(includedFile) === -1) {
            includedSassFiles.push(includedFile);
            const fileMeta = createFileMeta(config.sys, ctx, includedFile, '');
            fileMeta.recompileOnChange = true;
          }

          if (ctx.results.files.indexOf(includedFile) === -1) {
            ctx.results.files.push(includedFile);
          }
        });

        resolve();
      }
    });

  });
}


function validateCompile(config: CompilerConfig) {
  if (!config.sys) {
    throw 'config.sys required';
  }
  if (!config.sys.fs) {
    throw 'config.sys.fs required';
  }
  if (!config.sys.path) {
    throw 'config.sys.path required';
  }
  if (!config.sys.sass) {
    throw 'config.sys.sass required';
  }
  if (!config.sys.rollup) {
    throw 'config.sys.rollup required';
  }
  if (!config.sys.typescript) {
    throw 'config.sys.typescript required';
  }
}
