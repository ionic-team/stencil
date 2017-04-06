import { getFileMeta, isTsSourceFile, logError, readFile, writeFile } from './util';
import { CompilerConfig, CompilerContext, Manifest, Results } from './interfaces';
import { parseTsSrcFile } from './parser';
import { transpile } from './transpile';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';


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
 *
 * @param config  Compiler config
 * @param ctx  Option context object so rebuilds are faster
 */
export function compile(config: CompilerConfig, ctx: CompilerContext = {}): Promise<Results> {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  ctx.results = {};

  config.include = config.include || [];

  if (!config.exclude) {
    config.exclude = ['node_modules', 'bower_components'];
  }

  const promises = config.include.map(includePath => {
    return scanDirectory(includePath, config, ctx);
  });

  return Promise.all(promises)
    .then(() => {
      return transpile(config, ctx);

    }).then(() => {
      return processStyles(config, ctx);

    }).then(() => {
      return generateManifest(config, ctx);

    }).then(() => {
      return ctx.results;

    }).catch(err => {
      return logError(ctx.results, err);
    });
}


function scanDirectory(dir: string, config: CompilerConfig, ctx: CompilerContext) {
  return new Promise(resolve => {

    if (config.debug) {
      console.log(`scanDirectory: ${dir}`);
    }

    fs.readdir(dir, (err, files) => {
      if (err) {
        logError(ctx.results, err);
        resolve();
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(dirItem => {
        const readPath = path.join(dir, dirItem);

        if (!isValidDirectory(config, readPath)) {
          return;
        }

        promises.push(new Promise(resolve => {

          fs.stat(readPath, (err, stats) => {
            if (err) {
              logError(ctx.results, err);
              resolve();
              return;
            }

            if (stats.isDirectory()) {
              scanDirectory(readPath, config, ctx).then(() => {
                resolve();
              });

            } else if (isTsSourceFile(readPath)) {
              inspectTsFile(readPath, config, ctx).then(() => {
                resolve();
              });

            } else {
              resolve();
            }
          })

        }));

      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });

  });
}


function inspectTsFile(filePath: string, config: CompilerConfig, ctx: CompilerContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  if (config.debug) {
    console.log(`inspectTsFile: ${filePath}`);
  }

  return getFileMeta(ctx, filePath).then(fileMeta => {

    if (!fileMeta.isTsSourceFile || !fileMeta.isTransformable) {
      return;
    }

    parseTsSrcFile(fileMeta, config, ctx);
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


function processStyles(config: CompilerConfig, ctx: CompilerContext) {
  const destDir = config.compilerOptions.outDir;
  const promises: Promise<any>[] = [];

  const includedSassFiles: string[] = [];

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    Object.keys(f.cmpMeta.modes).forEach(modeName => {

      f.cmpMeta.modes[modeName].styleUrls.forEach(styleUrl => {
        const srcAbsolutePath = path.join(f.srcDir, styleUrl);

        promises.push(getIncludedSassFiles(config, ctx, includedSassFiles, srcAbsolutePath));
      });

    });
  });

  return Promise.all(promises).then(() => {
    const promises: Promise<any>[] = [];

    includedSassFiles.forEach(includedSassFile => {

      config.include.forEach(includeDir => {
        if (includedSassFile.indexOf(includeDir) === 0) {
          const src = includedSassFile;
          const relative = includedSassFile.replace(includeDir, '');
          const dest = path.join(destDir, relative);

          promises.push(readFile(src).then(content => {
            ts.sys.writeFile(dest, content);
          }));
        }
      });

    });

    return Promise.all(promises);
  });
}


function getIncludedSassFiles(config: CompilerConfig, ctx: CompilerContext, includedSassFiles: string[], scssFilePath: string) {
  return new Promise((resolve, reject) => {

    const sassConfig = {
      file: scssFilePath
    };

    config.packages.nodeSass.render(sassConfig, (err: any, result: any) => {
      if (err) {
        logError(ctx.results, err);
        reject(err);

      } else {
        result.stats.includedFiles.forEach((includedFile: string) => {
          if (includedSassFiles.indexOf(includedFile) === -1) {
            includedSassFiles.push(includedFile);
          }
        });

        resolve();
      }
    });

  });
}


function generateManifest(config: CompilerConfig, ctx: CompilerContext) {
  const manifest: Manifest = {
    components: {},
    bundles: []
  };

  const destDir = config.compilerOptions.outDir;

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    const componentUrl = f.jsFilePath.replace(destDir + path.sep, '');
    const modes = f.cmpMeta.modes;
    const componentDir = path.dirname(componentUrl);

    Object.keys(modes).forEach(modeName => {
      modes[modeName].styleUrls = modes[modeName].styleUrls.map(styleUrl => {
        return path.join(componentDir, styleUrl);
      });
    });

    manifest.components[f.cmpMeta.tag] = {
      componentUrl: componentUrl,
      modes: modes
    };
  });

  if (config.bundles) {
    manifest.bundles = config.bundles;

  } else {
    ctx.files.forEach(f => {
      if (f.isTsSourceFile && f.cmpMeta) {
        manifest.bundles.push([f.cmpMeta.tag]);
      }
    });
  }

  const manifestFile = path.join(config.compilerOptions.outDir, 'manifest.json')
  const json = JSON.stringify(manifest, null, 2);

  return writeFile(manifestFile, json)
}
