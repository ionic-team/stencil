import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { getAppBuildDir, getBrowserFilename, getDistEsmBuildDir, getEsmFilename } from '../app/app-file-naming';
import { getStyleIdPlaceholder, getStylePlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { hasError, pathJoin } from '../util';
import { minifyJs } from '../minifier';
import { PLUGIN_HELPERS } from '../style/style';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';


export async function generateBundles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], jsModules: d.JSModuleMap) {
  if (canSkipGenerateBundles(buildCtx)) {
    return null;
  }

  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = buildCtx.createTimeSpan(`generate bundles started`);

  const bundleKeys: { [key: string]: string } = {};

  await generateBundleModes(config, compilerCtx, buildCtx, entryModules, jsModules, bundleKeys);

  await Promise.all([
    genereateBrowserEsm(config, compilerCtx, buildCtx, jsModules, bundleKeys),
    genereateBrowserEs5(config, compilerCtx, buildCtx, jsModules, bundleKeys),
    genereateEsmEs5(config, compilerCtx, buildCtx, jsModules, bundleKeys)
  ]);

  // create the registry of all the components
  const cmpRegistry = createComponentRegistry(entryModules);

  timeSpan.finish(`generate bundles finished`);

  return cmpRegistry;
}


async function genereateBrowserEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, jsModules: d.JSModuleMap, bundleKeys: { [key: string]: string }) {
  const timeSpan = buildCtx.createTimeSpan(`genereateBrowserEsm started`, true);
  const esmModules = jsModules.esm;

  const entryKeys = Object.keys(esmModules);

  buildCtx.bundleBuildCount += entryKeys.length;

  const esmPromises = entryKeys
    .filter(entryKey => !bundleKeys[entryKey])
    .map(entryKey => { return [entryKey, esmModules[entryKey]] as [string, { code: string}]; })
    .map(async ([entryKey, value]) => {
      const fileName = getBrowserFilename(entryKey.replace('.js', ''), false, 'es2017');
      const jsText = replaceBundleIdPlaceholder(value.code, entryKey);
      await writeBundleJSFile(config, compilerCtx, fileName, jsText);
    });

  await Promise.all(esmPromises);

  timeSpan.finish(`genereateBrowserEsm finished`);
}


async function genereateBrowserEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, jsModules: d.JSModuleMap, bundleKeys: { [key: string]: string }) {
  if (config.buildEs5) {
    const timeSpan = buildCtx.createTimeSpan(`genereateBrowserEs5 started`, true);

    const es5Modules = jsModules.es5;

    const entryKeys = Object.keys(es5Modules);

    const es5Promises = entryKeys
      .filter(entryKey => !bundleKeys[entryKey])
      .map(entryKey => { return [entryKey, es5Modules[entryKey]] as [string, { code: string}]; })
      .map(async ([entryKey, value]) => {
        const fileName = getBrowserFilename(entryKey.replace('.js', ''), false, 'es5');
        let jsText = replaceBundleIdPlaceholder(value.code, entryKey);

        jsText = await transpileEs5Bundle(config, compilerCtx, buildCtx, jsText);

        if (config.minifyJs) {
          const results = await minifyJs(config, compilerCtx, jsText, 'es5', true);
          if (results.diagnostics.length === 0) {
            jsText = results.output;
          }
        }

        await writeBundleJSFile(config, compilerCtx, fileName, jsText);
      });
    await Promise.all(es5Promises);
    timeSpan.finish(`genereateBrowserEs5 finished`);
  }
}


async function genereateEsmEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, jsModules: d.JSModuleMap, bundleKeys: { [key: string]: string }) {
  const distOutputs = config.outputTargets.filter(o => o.type === 'dist');
  if (!distOutputs.length) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`genereateEsmEs5 started`, true);

  await Promise.all(distOutputs.map(async distOutput => {

    const es5Modules = jsModules.esmEs5;
    const es5Promises = Object.keys(es5Modules)
      .filter(key => !bundleKeys[key])
      .map(key => { return [key, es5Modules[key]] as [string, { code: string}]; })
      .map(async ([key, value]) => {
        const fileName = getBrowserFilename(key.replace('.js', ''), false);
        let jsText = replaceBundleIdPlaceholder(value.code, key);
        jsText = await transpileEs5Bundle(config, compilerCtx, buildCtx, jsText);

        const distBuildPath = pathJoin(config, getDistEsmBuildDir(config, distOutput), 'es5', fileName);
        return compilerCtx.fs.writeFile(distBuildPath, jsText);
      });

    await Promise.all(es5Promises);

  }));

  timeSpan.finish(`genereateEsmEs5 finished`);
}


async function writeBundleJSFile(config: d.Config, compilerCtx: d.CompilerCtx, fileName: string, jsText: string) {
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


async function generateBundleModes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], jsModules: d.JSModuleMap, bundleKeys: { [key: string]: string }) {
  const timeSpan = buildCtx.createTimeSpan(`generateBundleModes started`, true);

  await Promise.all(
    entryModules.map(async entryModule => {
      const bundleKeyPath = `${entryModule.entryKey}.js`;
      bundleKeys[bundleKeyPath] = entryModule.entryKey;
      entryModule.modeNames = entryModule.modeNames || [];

      return Promise.all(
        entryModule.modeNames.map(async modeName => {
          const jsCode = Object.keys(jsModules).reduce((all, moduleType: 'esm' | 'es5' | 'esmEs5') => {

            if (!jsModules[moduleType][bundleKeyPath] || !jsModules[moduleType][bundleKeyPath].code) {
              return all;
            }

            return {
              ...all,
              [moduleType]: jsModules[moduleType][bundleKeyPath].code
            };

          }, {} as {[key: string]: string});

          return await generateBundleMode(config, compilerCtx, buildCtx, entryModule, modeName, jsCode as any);
        })
      );
    })
  );

  timeSpan.finish(`generateBundleModes finished`);
}


async function generateBundleMode(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModule: d.EntryModule, modeName: string, jsCode: { esm: string, es5: string, esmEs5: string }) {

  // create js text for: mode, no scoped styles and esm
  let jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.esm, modeName, false);

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
  await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false);

  if (entryModule.requiresScopedStyles) {
    // create js text for: mode, scoped styles, esm
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.esm, modeName, true);

    // generate the bundle build for: mode, esm and scoped styles
    await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, true);
  }

  if (config.buildEs5) {
    // create js text for: mode, no scoped styles, es5
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.es5, modeName, false, 'es5');

    // generate the bundle build for: mode, no scoped styles and es5
    await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, 'es5');

    if (entryModule.requiresScopedStyles) {
      // create js text for: mode, scoped styles, es5
      jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.es5, modeName, true, 'es5');

      // generate the bundle build for: mode, es5 and scoped styles
      await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, true, 'es5');
    }
  }

  if (config.outputTargets.some(o => o.type === 'dist')) {
    // esm module with es5 target, not scoped
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.esmEs5, modeName, false, 'es5');
    await generateBundleEsmBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, 'es5');

    if (entryModule.requiresScopedStyles) {
      jsText = await createBundleJsText(config, compilerCtx, buildCtx, entryModule, jsCode.esmEs5, modeName, true, 'es5');
      await generateBundleEsmBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, true, 'es5');
    }
  }
}


async function createBundleJsText(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule, jsText: string, modeName: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {

  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    jsText = await transpileEs5Bundle(config, compilerCtx, buildCtx, jsText);
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


async function generateBundleBrowserBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  // create the file name
  const fileName = getBrowserFilename(bundleId, isScopedStyles, sourceTarget);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  const entryBundle: d.EntryBundle = {
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


async function generateBundleEsmBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  // create the file name
  const fileName = getEsmFilename(bundleId, isScopedStyles);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  const entryBundle: d.EntryBundle = {
    fileName: fileName,
    text: jsText,
    outputs: [],
    modeName: modeName,
    sourceTarget: sourceTarget,
    isScopedStyles: isScopedStyles
  };

  entryModule.entryBundles = entryModule.entryBundles || [];
  entryModule.entryBundles.push(entryBundle);

  const outputTargets = config.outputTargets.filter(o => o.type === 'dist');

  return Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved
    const esmBuildPath = pathJoin(config, getDistEsmBuildDir(config, outputTarget), 'es5', fileName);

    // write to the build
    await compilerCtx.fs.writeFile(esmBuildPath, jsText);
    entryBundle.outputs.push(esmBuildPath);
  }));
}


function injectStyleMode(moduleFiles: d.ModuleFile[], jsText: string, modeName: string, isScopedStyles: boolean) {
  moduleFiles.forEach(moduleFile => {
    jsText = injectComponentStyleMode(moduleFile.cmpMeta, modeName, jsText, isScopedStyles);
  });

  return jsText;
}

export function injectComponentStyleMode(cmpMeta: d.ComponentMeta, modeName: string, jsText: string, isScopedStyles: boolean) {
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

async function transpileEs5Bundle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, jsText: string) {
  // use typescript to convert this js text into es5
  const transpileResults = await transpileToEs5Main(config, compilerCtx, jsText);
  if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
    buildCtx.diagnostics.push(...transpileResults.diagnostics);
  }
  if (hasError(transpileResults.diagnostics)) {
    return jsText;
  }
  return transpileResults.code;
}


export function setBundleModeIds(moduleFiles: d.ModuleFile[], modeName: string, bundleId: string) {
  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
    if (typeof moduleFile.cmpMeta.bundleIds === 'object') {
      moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
    }
  });
}


export function getBundleId(config: d.Config, entryModule: d.EntryModule, modeName: string, jsText: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
  }

  return getBundleIdDev(entryModule, modeName);
}


export function getBundleIdHashed(config: d.Config, jsText: string) {
  return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
}


export function getBundleIdDev(entryModule: d.EntryModule, modeName: string) {
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

function createComponentRegistry(entryModules: d.EntryModule[]) {
  const registryComponents: d.ComponentMeta[] = [];
  const cmpRegistry: d.ComponentRegistry = {};

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


function canSkipGenerateBundles(buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort()) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild) {
    if (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges) {
      return false;
    }

    return true;
  }

  return false;
}

const EXTS = ['tsx', 'ts', 'js', 'css'];
PLUGIN_HELPERS.forEach(p => p.pluginExts.forEach(pe => EXTS.push(pe)));
