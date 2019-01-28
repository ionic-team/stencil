import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { getAppBuildDir, getBrowserFilename, getDistEsmComponentsDir, getEsmFilename } from '../app/app-file-naming';
import { getStyleIdPlaceholder, getStylePlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { pathJoin } from '../util';
import { PLUGIN_HELPERS } from '../style/component-styles';
import { OutputTargetDist } from '../../declarations';


export async function generateBundles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], rawModules: d.DerivedModule[]) {
  if (!rawModules || canSkipGenerateBundles(buildCtx)) {
    return {} as d.ComponentRegistry;
  }

  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = buildCtx.createTimeSpan(`generate bundles started`);

  const entryModulesMap = new Map<string, d.EntryModule>();
  entryModules.forEach(e => entryModulesMap.set(e.entryKey, e));

  buildCtx.bundleBuildCount += rawModules[0].list.length;

  await Promise.all([
    // Generate entry points for components. Each entry-point might emit several files
    // All different modes + scoped
    ...entryModules.map(entry => generateBundleModesEntryModule(config, compilerCtx, rawModules, entry)),

    // Generate chunk files, ie, not entry points for components: chunk-[hash].js
    ...rawModules.map(mod => generateChunkFiles(config, compilerCtx, buildCtx, mod, entryModulesMap))
  ]);

  // create the registry of all the components
  const cmpRegistry = createComponentRegistry(entryModules);

  timeSpan.finish(`generate bundles finished`);

  return cmpRegistry;
}


async function generateChunkFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, module: d.DerivedModule, entryModulesMap: Map<string, d.EntryModule>) {
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generateBrowserEsm started`, true);

  const esmPromises = module.list
    .filter(chunk => !entryModulesMap.has(chunk.entryKey))
    .map(async chunk => {
      // chunk asset, not a entry point, just write to the final destination
      if (module.browserBuild) {
        const fileName = `${chunk.entryKey}${module.sourceTarget === 'es5' ? '.es5' : ''}.js`;
        const jsText = replaceBundleIdPlaceholder(chunk.code, chunk.filename);
        await writeBrowserJSFile(config, compilerCtx, fileName, jsText);
      } else {
        await writeEsmJSFile(config, compilerCtx, module.sourceTarget, chunk.filename, chunk.code);
      }
    });

  await Promise.all(esmPromises);

  timeSpan.finish(`generateBrowserEsm finished`);
}


async function writeBrowserJSFile(config: d.Config, compilerCtx: d.CompilerCtx, fileName: string, jsText: string) {
  const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.appBuild) as d.OutputTargetBuild[];

  await Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved in www
    const buildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

    // write to the build dir
    await compilerCtx.fs.writeFile(buildPath, jsText);
  }));
}


async function writeEsmJSFile(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, fileName: string, jsText: string) {

  const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.type === 'dist') as d.OutputTargetDist[];

  await Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved in www
    const buildPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), fileName);

    // write to the build dir
    await compilerCtx.fs.writeFile(buildPath, jsText);
  }));
}

async function generateBundleModesEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, rawModules: d.DerivedModule[], entryModule: d.EntryModule) {
  const mainModule = rawModules[0];
  const entryKey = entryModule.entryKey;
  const chunkIndex = mainModule.list.findIndex(c => c.entryKey === entryKey);
  if (chunkIndex >= 0) {
    entryModule.modeNames = entryModule.modeNames || [];
    await Promise.all(
      entryModule.modeNames.map(modeName => (
        generateBundleMode(config, compilerCtx, entryModule, modeName, rawModules, chunkIndex)
      ))
    );
  }
}

async function generateBundleMode(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, modeName: string, rawModules: d.DerivedModule[], chunkIndex: number) {

  let bundleId: string;
  const promises = rawModules.map(async module => {
    const chunk = module.list[chunkIndex];
    const jsText = injectStyleMode(entryModule.moduleFiles, chunk.code, modeName, false);

    if (!bundleId) {
      // the only bundle id comes from mode, no scoped styles and esm
      bundleId = getBundleId(config, entryModule, modeName, jsText);

      // assign the bundle id build from the
      // mode, no scoped styles and esm to each of the components
      entryModule.moduleFiles.forEach(moduleFile => {
        moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
        if (typeof moduleFile.cmpMeta.bundleIds === 'object') {
          moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
        }
      });
    }

    // generate the bundle build for mode, no scoped styles, and esm
    if (module.browserBuild) {
      await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, module.sourceTarget);
    } else {
      await generateBundleEsmBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, module.sourceTarget);
    }

    if (entryModule.requiresScopedStyles && config.buildScoped) {
      // create js text for: mode, scoped styles, esm
      const scopedJsText = await injectStyleMode(entryModule.moduleFiles, chunk.code, modeName, true);

      // generate the bundle build for: mode, esm and scoped styles
      if (module.browserBuild) {
        await generateBundleBrowserBuild(config, compilerCtx, entryModule, scopedJsText, bundleId, modeName, true, module.sourceTarget);
      } else {
        await generateBundleEsmBuild(config, compilerCtx, entryModule, scopedJsText, bundleId, modeName, true, module.sourceTarget);
      }
    }
  });

  await Promise.all(promises);
}


async function generateBundleBrowserBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget: d.SourceTarget) {
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
  }) as d.OutputTargetBuild[];

  await Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved
    const wwwBuildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

    // write to the build
    await compilerCtx.fs.writeFile(wwwBuildPath, jsText);
    entryBundle.outputs.push(wwwBuildPath);
  }));
}


async function generateBundleEsmBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget: d.SourceTarget) {
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

  const outputTargets = config.outputTargets.filter(o => o.type === 'dist') as OutputTargetDist[];

  await Promise.all(outputTargets.map(async outputTarget => {
    // get the absolute path to where it'll be saved
    const esmBuildPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), fileName);

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
  if (typeof jsText !== 'string') {
    return '';
  }

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
    return getBundleIdHashed(config, jsText);
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
  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
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
