import { BuildConfig, BuildContext, Bundle, FilesMap,
  Manifest, ModuleFile, ModuleResults } from '../../util/interfaces';
import { buildError, catchError, hasError, generatePreamble, normalizePath } from '../util';
import { buildExpressionReplacer } from '../build/replacer';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { formatLoadComponents, formatJsBundleFileName, generateBundleId } from '../../util/data-serialize';


export function bundleModules(config: BuildConfig, ctx: BuildContext) {
  // create main module results object
  const moduleResults: ModuleResults = {
    bundles: {}
  };

  if (hasError(ctx.diagnostics)) {
    return Promise.resolve(moduleResults);
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed modules or components
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasComponentModules || ctx.changeHasNonComponentModules);

  const timeSpan = config.logger.createTimeSpan(`bundle modules started`, !doBundling);

  return Promise.all(ctx.manifest.bundles.map(userBundle => {
    return generateLoadComponentModules(config, ctx, ctx.manifest, userBundle, moduleResults);

  })).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    timeSpan.finish('bundle modules finished');
    return moduleResults;
  });
}


function generateLoadComponentModules(config: BuildConfig, ctx: BuildContext, appManifest: Manifest, userBundle: Bundle, moduleResults: ModuleResults) {
  const sys = config.sys;

  const bundleModuleFiles = userBundle.components.map(userBundleComponentTag => {
    const cmpMeta = appManifest.modulesFiles.find(moduleFile => {
      return moduleFile.cmpMeta.tagNameMeta === userBundleComponentTag;
    });

    if (!cmpMeta) {
      const d = buildError(ctx.diagnostics);
      d.messageText = `Unable to find component "${userBundleComponentTag}" in available config and collection.`;
    }
    return cmpMeta;
  }).filter(c => !!c);

  if (!bundleModuleFiles.length) {
    const d = buildError(ctx.diagnostics);
    d.messageText = `No components found to bundle`;
    return Promise.resolve(moduleResults);
  }

  const bundleId = generateBundleId(userBundle.components);

  // loop through each bundle the user wants and create the "loadComponents"
  return bundleComponentModules(config, ctx, bundleModuleFiles, bundleId).then(bundleDetails => {
    if (hasError(ctx.diagnostics)) {
      return;
    }

    // format all the JS bundle content
    // insert the already bundled JS module into the loadComponents function
    let moduleContent = formatLoadComponents(
      config.namespace, STENCIL_BUNDLE_ID,
      bundleDetails.content, bundleModuleFiles
    );

    if (config.minifyJs) {
      // minify js
      const minifyJsResults = sys.minifyJs(moduleContent);
      minifyJsResults.diagnostics.forEach(d => {
        ctx.diagnostics.push(d);
      });

      if (!minifyJsResults.diagnostics.length) {
        moduleContent = minifyJsResults.output;
      }
    }

    if (config.hashFileNames) {
      // create module id from hashing the content
      moduleResults.bundles[bundleId] = sys.generateContentHash(moduleContent, config.hashedFileNameLength);

    } else {
      // create module id from list of component tags in this file
      // can get a lil too long, so let's simmer down
      moduleResults.bundles[bundleId] = userBundle.components[0].toLowerCase();
    }

    // replace the known bundle id template with the newly created bundle id
    moduleContent = moduleContent.replace(MODULE_ID_REGEX, moduleResults.bundles[bundleId]);

    if (bundleDetails.writeFile) {
      // create the file name and path of where the bundle will be saved
      const moduleFileName = formatJsBundleFileName(moduleResults.bundles[bundleId]);
      const moduleFilePath = normalizePath(sys.path.join(config.buildDir, config.namespace.toLowerCase(), moduleFileName));

      ctx.moduleBundleCount++;

      ctx.filesToWrite[moduleFilePath] = generatePreamble(config) + moduleContent;
    }

  }).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    return moduleResults;
  });
}


function bundleComponentModules(config: BuildConfig, ctx: BuildContext, bundleModuleFiles: ModuleFile[], bundleId: string) {
  const bundleDetails: ModuleBundleDetails = {};
  const sys = config.sys;

  if (ctx.isChangeBuild && !ctx.changeHasComponentModules && !ctx.changeHasNonComponentModules && ctx.moduleBundleOutputs[bundleId]) {
    // don't bother bundling if this is a change build but
    // none of the changed files are modules or components
    bundleDetails.content = ctx.moduleBundleOutputs[bundleId];
    bundleDetails.writeFile = false;
    return Promise.resolve(bundleDetails);
  }

  const entryFileLines: string[] = [];

  // loop through all the components this bundle needs
  // and generate a string of the JS file to be generated
  bundleModuleFiles.sort((a, b) => {
    if (a.cmpMeta.tagNameMeta.toLowerCase() < b.cmpMeta.tagNameMeta.toLowerCase()) return -1;
    if (a.cmpMeta.tagNameMeta.toLowerCase() > b.cmpMeta.tagNameMeta.toLowerCase()) return 1;
    return 0;

  }).forEach(moduleFile => {
    // create a full path to the modules to import
    let importPath = moduleFile.jsFilePath;

    // manually create the content for our temporary entry file for the bundler
    entryFileLines.push(`import { ${moduleFile.cmpMeta.componentClass} } from "${importPath}";`);

    // export map should always use UPPER CASE tag name
    entryFileLines.push(`exports['${moduleFile.cmpMeta.tagNameMeta.toUpperCase()}'] = ${moduleFile.cmpMeta.componentClass};`);
  });

  // create the entry file for the bundler
  const moduleBundleInput = entryFileLines.join('\n');

  if (ctx.isChangeBuild && ctx.changeHasComponentModules && !ctx.changeHasNonComponentModules) {
    // this is a change build, and there are no non-component changes
    // but there are component changes, so lets hash our files together and compare
    // if the original content is the same then we don't need to continue the bundle

    // loop through all the changed typescript filename and see if there are corresponding js filenames
    // if there are no filenames that match then let's not bundle
    // yes...there could be two files that have the same filename in different directories
    // but worst case scenario is that both of them run their bundling, which isn't a performance problem
    const hasChangedFileName = bundleModuleFiles.some(moduleFile => {
      const distFileName = sys.path.basename(moduleFile.jsFilePath, '.js');
      return ctx.changedFiles.some(f => {
        const changedFileName = sys.path.basename(f);
        return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
      });
    });

    if (!hasChangedFileName && ctx.moduleBundleOutputs[bundleId]) {
      // don't bother bundling, none of the changed files have the same filename
      bundleDetails.content = ctx.moduleBundleOutputs[bundleId];
      bundleDetails.writeFile = false;
      return Promise.resolve(bundleDetails);
    }
  }


  // start the bundler on our temporary file
  return sys.rollup.rollup({
    entry: STENCIL_BUNDLE_ID,
    plugins: [
      sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      entryInMemoryPlugin(STENCIL_BUNDLE_ID, moduleBundleInput),
      transpiledInMemoryPlugin(config, ctx)
    ],
    onwarn: createOnWarnFn(ctx.diagnostics, bundleModuleFiles)

  }).catch(err => {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
    // return null;

  }).then(rollupBundle => {
    if (hasError(ctx.diagnostics) || !rollupBundle) {
      return bundleDetails;
    }

    // generate the bundler results
    return rollupBundle.generate({
      format: 'es'

    }).then(results => {
      // module bundling finished, assign its content to the user's bundle
      // wrap our component code with our own iife
      bundleDetails.content = `function importComponent(exports, h, t, Context, publicPath) {\n${results.code.trim()}\n}`;

      // replace build time expressions, like process.env.NODE_ENV === 'production'
      // with a hard coded boolean
      bundleDetails.content = buildExpressionReplacer(config, bundleDetails.content);

      // cache for later
      ctx.moduleBundleOutputs[bundleId] = bundleDetails.content;

      bundleDetails.writeFile = true;
      return bundleDetails;

    });
  });
}

interface ModuleBundleDetails {
  content?: string;
  writeFile?: boolean;
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


const STENCIL_BUNDLE_ID = '__STENCIL__BUNDLE__ID__';
const MODULE_ID_REGEX = new RegExp(STENCIL_BUNDLE_ID, 'g');
