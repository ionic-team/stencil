import { copyFile, getFileMeta, isTsSourceFile, writeFile } from './util';
import { GenerateConfig, GenerateContext, Manifest } from './interfaces';
import { parseTsSrcFile } from './parser';
import { transpile } from './transpile';
import * as fs from 'fs';
import * as path from 'path';


export function generate(config: GenerateConfig, ctx: GenerateContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

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
      return generateManifest(config, ctx);
    });
}


function scanDirectory(dir: string, config: GenerateConfig, ctx: GenerateContext) {
  return new Promise(resolve => {

    if (config.debug) {
      console.log(`scanDirectory: ${dir}`);
    }

    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
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
              console.log(err);
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


function inspectTsFile(filePath: string, config: GenerateConfig, ctx: GenerateContext = {}) {
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


function isValidDirectory(config: GenerateConfig, filePath: string) {
  for (var i = 0; i < config.exclude.length; i++) {
    if (filePath.indexOf(config.exclude[i]) > -1) {
      return false;
    }
  }
  return true;
}


function generateManifest(config: GenerateConfig, ctx: GenerateContext) {
  const manifest: Manifest = {
    components: {},
    bundles: []
  };

  const destDir = config.compilerOptions.outDir;
  const promises: Promise<any>[] = [];

  ctx.files.forEach(f => {
    if (!f.isTsSourceFile || !f.cmpMeta) return;

    const cmpMeta = Object.assign({}, f.cmpMeta);
    const componentUrl = f.jsFilePath.replace(destDir + path.sep, '');
    const modes = cmpMeta.modes;
    const componentDir = path.dirname(componentUrl);

    Object.keys(modes).forEach(modeName => {
      modes[modeName].styleUrls = modes[modeName].styleUrls.map(styleUrl => {
        const relativePath = path.join(componentDir, styleUrl);
        const srcAbsolutePath = path.join(f.srcDir, styleUrl);
        const destAbsolutePath = path.join(destDir, relativePath);

        promises.push(copyFile(srcAbsolutePath, destAbsolutePath));

        return relativePath;
      });
    });

    manifest.components[cmpMeta.tag] = {
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

  promises.push(writeFile(manifestFile, json));

  return Promise.all(promises);
}
