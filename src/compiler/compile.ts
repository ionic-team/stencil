import { BuildContext, Component, CompilerConfig, Manifest, Results } from './interfaces';
import { getFileMeta, isTsSourceFile, logError, readFile, writeFile, writeFiles } from './util';
import { transpile } from './transpile';


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
export function compile(config: CompilerConfig, ctx: BuildContext = {}): Promise<Results> {
  if (!config.packages) {
    throw 'config.packages required';
  }
  if (!config.packages.fs) {
    throw 'config.packages.fs required';
  }
  if (!config.packages.path) {
    throw 'config.packages.path required';
  }
  if (!config.packages.nodeSass) {
    throw 'config.packages.nodeSass required';
  }
  if (!config.packages.rollup) {
    throw 'config.packages.rollup required';
  }
  if (!config.packages.typescript) {
    throw 'config.packages.typescript required';
  }

  if (config.debug) {
    console.log(`compile, include: ${config.include}`);
    console.log(`compile, outDir: ${config.compilerOptions.outDir}`);
  }

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

    });
}


function scanDirectory(dir: string, config: CompilerConfig, ctx: BuildContext) {
  return new Promise(resolve => {

    if (config.debug) {
      console.log(`compile, scanDirectory: ${dir}`);
    }

    config.packages.fs.readdir(dir, (err, files) => {
      if (err) {
        logError(ctx.results, err);
        resolve();
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(dirItem => {
        const readPath = config.packages.path.join(dir, dirItem);

        if (!isValidDirectory(config, readPath)) {
          return;
        }

        promises.push(new Promise(resolve => {

          config.packages.fs.stat(readPath, (err, stats) => {
            if (err) {
              logError(ctx.results, err);
              resolve();

            } else if (stats.isDirectory()) {
              scanDirectory(readPath, config, ctx).then(() => {
                resolve();
              });

            } else if (isTsSourceFile(readPath)) {
              getFileMeta(config, ctx, readPath).then(() => {
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
  const promises: Promise<any>[] = [];

  const includedSassFiles: string[] = [];

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    Object.keys(f.cmpMeta.modes).forEach(modeName => {
      const mode = f.cmpMeta.modes[modeName];

      if (mode && mode.styleUrls) {
        mode.styleUrls.forEach(styleUrl => {
          const srcAbsolutePath = config.packages.path.join(f.srcDir, styleUrl);

          promises.push(getIncludedSassFiles(config, ctx, includedSassFiles, srcAbsolutePath));
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
          const dest = config.packages.path.join(destDir, relative);

          promises.push(readFile(config.packages, src).then(content => {
            files.set(dest, content);
          }));
        }
      });

    });

    return Promise.all(promises).then(() => {
      return writeFiles(config.packages, files);
    });
  });
}


function getIncludedSassFiles(config: CompilerConfig, ctx: BuildContext, includedSassFiles: string[], scssFilePath: string) {
  return new Promise((resolve, reject) => {

    const sassConfig = {
      file: scssFilePath
    };

    if (config.debug) {
      console.log(`compile, getIncludedSassFiles: ${scssFilePath}`);
    }

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


function generateManifest(config: CompilerConfig, ctx: BuildContext) {
  const manifest: Manifest = {
    components: {},
    bundles: []
  };

  let components: Component[] = [];

  const destDir = config.compilerOptions.outDir;

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    const componentUrl = f.jsFilePath.replace(destDir + config.packages.path.sep, '');
    const modes = f.cmpMeta.modes;
    const componentDir = config.packages.path.dirname(componentUrl);

    Object.keys(modes).forEach(modeName => {
      const mode = modes[modeName];

      if (mode && mode.styleUrls) {
        mode.styleUrls = mode.styleUrls.map(styleUrl => {
          return config.packages.path.join(componentDir, styleUrl);
        });
      }
    });

    components.push({
      tag: f.cmpMeta.tag,
      componentUrl: componentUrl,
      componentClass: f.cmpClassName,
      modes: modes,
      props: f.cmpMeta.props,
      listeners: f.cmpMeta.listeners,
      watchers: f.cmpMeta.watchers,
      shadow: f.cmpMeta.shadow
    });
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

  components = components.sort((a, b) => {
    if (a.tag < b.tag) {
      return -1;
    }
    if (a.tag > b.tag) {
      return 1;
    }
    return 0;
  });

  components.forEach(cmp => {
    manifest.components[cmp.tag] = {
      componentUrl: cmp.componentUrl,
      componentClass: cmp.componentClass,
      modes: cmp.modes,
      props: cmp.props,
      listeners: cmp.listeners,
      watchers: cmp.watchers,
      shadow: cmp.shadow
    };
  });

  const manifestFile = config.packages.path.join(config.compilerOptions.outDir, 'manifest.json');
  const json = JSON.stringify(manifest, null, 2);

  return writeFile(config.packages, manifestFile, json);
}
