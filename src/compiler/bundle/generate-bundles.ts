import { BuildCtx, CompilerCtx, ComponentMeta, ComponentRegistry, Config, EntryBundle, EntryModule, JSModuleMap, ModuleFile, SourceTarget } from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { getAppBuildDir, getBundleFilename } from '../app/app-file-naming';
import { getStyleIdPlaceholder, getStylePlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { hasError, minifyJs, pathJoin } from '../util';
import { transpileToEs5 } from '../transpile/core-build';


export async function generateBundles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[], jsModules: JSModuleMap) {
  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = config.logger.createTimeSpan(`generate bundles started`);
  config.logger.debug(`generate bundles started`);

  const bundleKeys: { [key: string]: string } = {};

  await Promise.all(
    entryModules.map(async entryModule => {
      const bundleKeyPath = `${entryModule.entryKey}.js`;
      bundleKeys[bundleKeyPath] = entryModule.entryKey;
      entryModule.modeNames = entryModule.modeNames || [];

      return Promise.all(
        entryModule.modeNames.map(async modeName => {
          const jsCode = Object.keys(jsModules).reduce((all, moduleType: 'esm' | 'es5') => {
            return {
              ...all,
              [moduleType]: jsModules[moduleType][bundleKeyPath].code
            };
          }, {} as {[key: string]: string});

          return await generateBundleMode(config, compilerCtx, buildCtx, entryModule, modeName, jsCode);
        })
      );
    })
  );
  config.logger.debug(`bundle mode finished`);

  const esmModules = jsModules.esm;
  const esmPromises = Object.keys(esmModules)
    .filter(key => !bundleKeys[key])
    .map(key => { return [key, esmModules[key]] as [string, { code: string}]; })
    .map(async ([key, value]) => {
      const fileName = getBundleFilename(key.replace('.js', ''), false, 'es2015');
      const jsText = replaceBundleIdPlaceholder(value.code, key);
      await writeBundleJSFile(config, compilerCtx, fileName, jsText);
    });
  await Promise.all(esmPromises);
  config.logger.debug(`generate esm finished`);

  if (config.buildEs5) {
    const es5Modules = jsModules.es5;
    const es5Promises = Object.keys(es5Modules)
      .filter(key => !bundleKeys[key])
      .map(key => { return [key, es5Modules[key]] as [string, { code: string}]; })
      .map(async ([key, value]) => {
        const fileName = getBundleFilename(key.replace('.js', ''), false, 'es5');
        let jsText = replaceBundleIdPlaceholder(value.code, key);
        jsText = await transpileEs5Bundle(compilerCtx, buildCtx, jsText);
        await writeBundleJSFile(config, compilerCtx, fileName, jsText);
      });
    await Promise.all(es5Promises);
    config.logger.debug(`generate es5 finished`);
  }


  // create the registry of all the components
  const cmpRegistry = createComponentRegistry(entryModules);

  timeSpan.finish(`generate bundles finished`);
  config.logger.debug(`generate bundles finished`);

  return cmpRegistry;
}

async function writeBundleJSFile(config: Config, compilerCtx: CompilerCtx, fileName: string, jsText: string) {

  const outputTargets = config.outputTargets.filter(outputTarget => {
    return outputTarget.appBuild;
  });

  return Promise.all(outputTargets.map(outputTarget => {
    // get the absolute path to where it'll be saved in www
    const wwwBuildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

    // write to the www build
    return compilerCtx.fs.writeFile(wwwBuildPath, jsText);
  }));
}

async function generateBundleMode(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModule: EntryModule, modeName: string, jsCode: { [key: string]: string }) {

  // create js text for: mode, no scoped styles and esm
  let jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode['esm'], modeName, false);

  // the only bundle id comes from mode, no scoped styles and esm
  const bundleId = getBundleId(config, entryModule, modeName, jsText);

  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  entryModule.moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
    if (typeof moduleFile.cmpMeta.bundleIds === 'object') {
      moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
    }
  });

  // generate the bundle build for mode, no scoped styles, and esm
  await generateBundleBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false);

  if (entryModule.requiresScopedStyles) {
    // create js text for: mode, scoped styles, esm
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode['esm'], modeName, true);

    // generate the bundle build for: mode, esm and scoped styles
    await generateBundleBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, true);
  }

  if (config.buildEs5) {
    // create js text for: mode, no scoped styles, es5
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode['es5'], modeName, false, 'es5');

    // generate the bundle build for: mode, no scoped styles and es5
    await generateBundleBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, 'es5');

    if (entryModule.requiresScopedStyles) {
      // create js text for: mode, scoped styles, es5
      jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode['es5'], modeName, true, 'es5');

      // generate the bundle build for: mode, es5 and scoped styles
      await generateBundleBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, true, 'es5');
    }
  }
}


async function createBundleJsText(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule, jsText: string, modeName: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {

  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    jsText = await transpileEs5Bundle(compilerCtx, buildCtx, jsText);
  }

  if (config.minifyJs) {
    // minify the bundle js text
    const minifyJsResults = await minifyJs(config, compilerCtx, jsText, sourceTarget, true);
    if (minifyJsResults.diagnostics.length) {
      minifyJsResults.diagnostics.forEach(d => {
        buildCtx.diagnostics.push(d);
      });

    } else {
      jsText = minifyJsResults.output;
    }
  }

  return injectStyleMode(entryModules.moduleFiles, jsText, modeName, isScopedStyles);
}


async function generateBundleBuild(config: Config, compilerCtx: CompilerCtx, entryModule: EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // create the file name
  const fileName = getBundleFilename(bundleId, isScopedStyles, sourceTarget);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  const entryBundle: EntryBundle = {
    fileName: fileName,
    text: jsText,
    outputs: [],
    modeName: modeName,
    sourceTarget: sourceTarget,
    isScopedStyles: isScopedStyles
  };

  entryModule.entryBundles = entryModule.entryBundles || [];
  entryModule.entryBundles.push(entryBundle);

  const outputTargets = config.outputTargets.filter(outputTarget => {
    return outputTarget.appBuild;
  });

  return Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved
    const wwwBuildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

    // write to the build
    await compilerCtx.fs.writeFile(wwwBuildPath, jsText);
    entryBundle.outputs.push(wwwBuildPath);
  }));
}


function injectStyleMode(moduleFiles: ModuleFile[], jsText: string, modeName: string, isScopedStyles: boolean) {
  moduleFiles.forEach(moduleFile => {
    jsText = injectComponentStyleMode(moduleFile.cmpMeta, modeName, jsText, isScopedStyles);
  });

  return jsText;
}

export function injectComponentStyleMode(cmpMeta: ComponentMeta, modeName: string, jsText: string, isScopedStyles: boolean) {
  const stylePlaceholder = getStylePlaceholder(cmpMeta.tagNameMeta);
  const stylePlaceholderId = getStyleIdPlaceholder(cmpMeta.tagNameMeta);

  let styleText = '';

  if (cmpMeta.stylesMeta) {
    let modeStyles = cmpMeta.stylesMeta[modeName];
    if (modeStyles) {
      if (isScopedStyles) {
        // we specifically want scoped css
        styleText = modeStyles.compiledStyleTextScoped;
      }
      if (!styleText) {
        // either we don't want scoped css
        // or we DO want scoped css, but we don't have any
        // use the un-scoped css
        styleText = modeStyles.compiledStyleText || '';
      }

    } else {
      modeStyles = cmpMeta.stylesMeta[DEFAULT_STYLE_MODE];
      if (modeStyles) {
        if (isScopedStyles) {
          // we specifically want scoped css
          styleText = modeStyles.compiledStyleTextScoped;
        }
        if (!styleText) {
          // either we don't want scoped css
          // or we DO want scoped css, but we don't have any
          // use the un-scoped css
          styleText = modeStyles.compiledStyleText || '';
        }
      }
    }
  }

  // replace the style placeholder string that's already in the js text
  jsText = jsText.replace(stylePlaceholder, styleText);

  // replace the style id placeholder string that's already in the js text
  jsText = jsText.replace(stylePlaceholderId, modeName);

  // return the js text with the newly inject style
  return jsText;
}

async function transpileEs5Bundle(compilerCtx: CompilerCtx, buildCtx: BuildCtx, jsText: string) {
  // use typescript to convert this js text into es5
  const transpileResults = await transpileToEs5(compilerCtx, jsText);
  if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
    buildCtx.diagnostics.push(...transpileResults.diagnostics);
  }
  if (hasError(transpileResults.diagnostics)) {
    return jsText;
  }
  return transpileResults.code;
}


export function setBundleModeIds(moduleFiles: ModuleFile[], modeName: string, bundleId: string) {
  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
    if (typeof moduleFile.cmpMeta.bundleIds === 'object') {
      moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
    }
  });
}


export function getBundleId(config: Config, entryModule: EntryModule, modeName: string, jsText: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
  }

  return getBundleIdDev(entryModule, modeName);
}


export function getBundleIdHashed(config: Config, jsText: string) {
  return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
}


export function getBundleIdDev(entryModule: EntryModule, modeName: string) {
  const tags = entryModule.moduleFiles
    .sort((a, b) => {
      if (a.isCollectionDependency && !b.isCollectionDependency) {
        return 1;
      }
      if (!a.isCollectionDependency && b.isCollectionDependency) {
        return -1;
      }

      if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
      if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
      return 0;
    })
    .map(m => m.cmpMeta.tagNameMeta);

  if (modeName === DEFAULT_STYLE_MODE || !modeName) {
    return tags[0];
  }

  return `${tags[0]}.${modeName}`;
}

function createComponentRegistry(entryModules: EntryModule[]) {
  const registryComponents: ComponentMeta[] = [];
  const cmpRegistry: ComponentRegistry = {};

  return entryModules
    .reduce((rcs, bundle) => {
      const cmpMetas = bundle.moduleFiles
        .filter(m => m.cmpMeta)
        .map(moduleFile => moduleFile.cmpMeta);

      return rcs.concat(cmpMetas);
    }, registryComponents)
    .sort((a, b) => {
      if (a.tagNameMeta < b.tagNameMeta) return -1;
      if (a.tagNameMeta > b.tagNameMeta) return 1;
      return 0;
    })
    .reduce((registry, cmpMeta) => {
      return {
        ...registry,
        [cmpMeta.tagNameMeta]: cmpMeta
      };
    }, cmpRegistry);
}
