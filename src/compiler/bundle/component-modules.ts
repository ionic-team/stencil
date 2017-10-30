import { BuildConfig, BuildContext, FilesMap, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { hasError, normalizePath } from '../util';
import { buildExpressionReplacer } from '../build/replacer';
import { dashToPascalCase } from '../../util/helpers';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';


export function generateComponentModules(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  const bundleCacheKey = getModuleBundleCacheKey(manifestBundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta));

  if (canSkipBuild(config, ctx, manifestBundle.moduleFiles, bundleCacheKey)) {
    // don't bother bundling if this is a change build but
    // none of the changed files are modules or components
    manifestBundle.compiledModuleText = ctx.moduleBundleOutputs[bundleCacheKey];
    return Promise.resolve();
  }

  // create the input file for the bundler
  // returned value is array of strings so it needs to be joined here
  const moduleBundleInput = createInMemoryBundleInput(manifestBundle.moduleFiles).join('\n');

  // start the bundler on our temporary file
  return bundleComponents(config, ctx, manifestBundle, moduleBundleInput, bundleCacheKey);
}


function bundleComponents(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, moduleBundleInput: string, bundleCacheKey: string) {
  // start the bundler on our temporary file
  return config.sys.rollup.rollup({
    input: IN_MEMORY_INPUT,
    plugins: [
      config.sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      config.sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      entryInMemoryPlugin(IN_MEMORY_INPUT, moduleBundleInput),
      transpiledInMemoryPlugin(config, ctx)
    ],
    onwarn: createOnWarnFn(ctx.diagnostics, manifestBundle.moduleFiles)

  }).catch(err => {
    loadRollupDiagnostics(config, ctx.diagnostics, err);

  }).then(rollupBundle => {
    if (hasError(ctx.diagnostics) || !rollupBundle) {
      return Promise.resolve();
    }

    // generate the bundler results
    return rollupBundle.generate({
      format: 'es'

    }).then(results => {
      // module bundling finished, assign its content to the user's bundle
      // wrap our component code with our own iife
      manifestBundle.compiledModuleText = wrapComponentImports(results.code.trim());

      // replace build time expressions, like process.env.NODE_ENV === 'production'
      // with a hard coded boolean
      manifestBundle.compiledModuleText = buildExpressionReplacer(config, manifestBundle.compiledModuleText);

      // cache for later
      ctx.moduleBundleOutputs[bundleCacheKey] = manifestBundle.compiledModuleText;

      // keep track of module bundling for testing
      ctx.moduleBundleCount++;
    });
  });
}


export function wrapComponentImports(content: string) {
  return `function importComponent(exports, h, t, Context, publicPath) {\n"use strict";\n${content}\n}`;
}


export function transpiledInMemoryPlugin(config: BuildConfig, ctx: BuildContext) {
  const sys = config.sys;
  const assetsCache: FilesMap = {};

  return {
    name: 'transpiledInMemoryPlugin',

    resolveId(importee: string, importer: string): string {
      if (!sys.path.isAbsolute(importee)) {
        importee = normalizePath(sys.path.resolve(importer ? sys.path.dirname(importer) : sys.path.resolve(), importee));

        if (importee.indexOf('.js') === -1) {
          importee += '.js';
        }
      }

      // it's possible the importee is a file pointing directly to the source ts file
      // if it is a ts file path, then we're good to go
      var moduleFile = ctx.moduleFiles[importee];
      if (ctx.moduleFiles[importee]) {
        return moduleFile.jsFilePath;
      }

      const tsFileNames = Object.keys(ctx.moduleFiles);
      for (var i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeE
        moduleFile = ctx.moduleFiles[tsFileNames[i]];
        if (moduleFile.jsFilePath === importee) {
          // awesome, there's a module file for this js file, we're good here
          return importee;
        }
      }

      // let's check all of the asset directories for this path
      // think slide's swiper dependency
      for (i = 0; i < tsFileNames.length; i++) {
        // see if we can find by importeR
        moduleFile = ctx.moduleFiles[tsFileNames[i]];
        if (moduleFile.jsFilePath === importer) {
          // awesome, there's a module file for this js file via importeR
          // now let's check if this module has an assets directory
          if (moduleFile.cmpMeta && moduleFile.cmpMeta.assetsDirsMeta) {
            for (var j = 0; j < moduleFile.cmpMeta.assetsDirsMeta.length; j++) {
              var assetsAbsPath = moduleFile.cmpMeta.assetsDirsMeta[j].absolutePath;
              var importeeFileName = sys.path.basename(importee);
              var assetsFilePath = normalizePath(sys.path.join(assetsAbsPath, importeeFileName));

              // ok, we've got a potential absolute path where the file "could" be
              try {
                // let's see if it actually exists, but with readFileSync :(
                assetsCache[assetsFilePath] = sys.fs.readFileSync(assetsFilePath, 'utf-8');
                if (typeof assetsCache[assetsFilePath] === 'string') {
                  return assetsFilePath;
                }

              } catch (e) {
                config.logger.debug(`asset ${assetsFilePath} did not exist`);
              }
            }
          }
        }
      }

      return null;
    },

    load(sourcePath: string): string {
      sourcePath = normalizePath(sourcePath);

      if (typeof ctx.jsFiles[sourcePath] === 'string') {
        // perfect, we already got this js file cached
        return ctx.jsFiles[sourcePath];
      }

      if (typeof assetsCache[sourcePath] === 'string') {
        // awesome, this is one of the cached asset file we already read in resolveId
        return assetsCache[sourcePath];
      }

      // ok so it's not in one of our caches, so let's look it up directly
      // but with readFileSync :(
      const jsText = sys.fs.readFileSync(sourcePath, 'utf-8' );
      ctx.moduleFiles[sourcePath] = {
        jsFilePath: sourcePath,
      };
      ctx.jsFiles[sourcePath] = jsText;

      return jsText;
    }
  };
}


function entryInMemoryPlugin(entryKey: string, moduleBundleInput: string) {
  // used just so we don't have to write a temporary file to disk
  // just to turn around and immediately have rollup open and read it
  return {
    name: 'entryInMemoryPlugin',
    resolveId(importee: string): string {
      if (importee === entryKey) {
        return entryKey;
      }
      return null;
    },
    load(sourcePath: string): string {
      if (sourcePath === entryKey) {
        return moduleBundleInput;
      }
      return null;
    }
  };
}


export function createInMemoryBundleInput(moduleFiles: ModuleFile[]) {
  const entryFileLines: string[] = [];

  moduleFiles.sort((a, b) => {
    if (a.cmpMeta.tagNameMeta.toLowerCase() < b.cmpMeta.tagNameMeta.toLowerCase()) return -1;
    if (a.cmpMeta.tagNameMeta.toLowerCase() > b.cmpMeta.tagNameMeta.toLowerCase()) return 1;
    return 0;

  }).forEach(moduleFile => {
    // create a full path to the modules to import
    const importPath = moduleFile.jsFilePath;
    const asName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

    // manually create the content for our temporary entry file for the bundler
    entryFileLines.push(generateBundleImport(moduleFile.cmpMeta.componentClass, asName, importPath));

    // export map should always use UPPER CASE tag name
    entryFileLines.push(generateBundleExport(moduleFile.cmpMeta.tagNameMeta, asName));
  });

  // create the entry file for the bundler
  return entryFileLines;
}


export function generateBundleImport(cmpClassName: string, asName: string, importPath: string) {
  return `import { ${cmpClassName} as ${asName} } from "${normalizePath(importPath)}";`;
}


export function generateBundleExport(tagName: string, asName: string) {
  return `exports['${tagName.toLowerCase()}'] = ${asName};`;
}


export function canSkipBuild(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFile[], cacheKey: string) {
  // must build if it's not a change build
  if (!ctx.isChangeBuild) {
    return false;
  }

  // cannot skip if there isn't anything cached
  if (!ctx.moduleBundleOutputs[cacheKey]) {
    return false;
  }

  // must rebuild if it's non-component changes
  // basically don't know of deps of deps changed, so play it safe
  if (ctx.changeHasNonComponentModules) {
    return false;
  }

  // ok to skip if it wasn't a component module change
  if (!ctx.changeHasComponentModules) {
    return true;
  }

  // check if this bundle has one of the changed files
  const bundleContainsChangedFile = bundledComponentContainsChangedFile(config, moduleFiles, ctx.changedFiles);
  if (!bundleContainsChangedFile) {
    // don't bother bundling, none of the changed files have the same filename
    return true;
  }

  // idk, probs need to bundle, can't skip
  return false;
}


export function bundledComponentContainsChangedFile(config: BuildConfig, bundlesModuleFiles: ModuleFile[], changedFiles: string[]) {
  // loop through all the changed typescript filenames and see if there are corresponding js filenames
  // if there are no filenames that match then let's not bundle
  // yes...there could be two files that have the same filename in different directories
  // but worst case scenario is that both of them run their bundling, which isn't a performance problem
  return bundlesModuleFiles.some(moduleFile => {
    const distFileName = config.sys.path.basename(moduleFile.jsFilePath, '.js');
    return changedFiles.some(f => {
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });
  });
}


export function getModuleBundleCacheKey(components: string[]) {
  return components.map(c => c.toLocaleLowerCase().trim()).sort().join('.');
}


const IN_MEMORY_INPUT = '__IN_MEMORY_INPUT__';
