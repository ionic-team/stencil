import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { generateChunkFiles } from './generate-chunk-files';
import { generateLazyModuleMap } from './lazy-module-map';
// import { getAppBuildDir, getBrowserFilename, getDistEsmComponentsDir, getEsmFilename } from '../app/app-file-naming';
import { getStyleIdPlaceholder, getStylePlaceholder } from '../../util/data-serialize';
// import { OutputTargetDist } from '../../declarations';
// import { pathJoin } from '../util';
import { PLUGIN_HELPERS } from '../style/component-styles';


export async function generateLazyBundles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipGenerateBundles(buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`generate lazy bundles started`);

  // generate the bundled modules, but without the styles added
  const rawModules = await generateLazyModuleMap(config, compilerCtx, buildCtx);

  if (rawModules != null) {
    // Generate chunk files, ie, not entry points for components: chunk-[hash].js
    const chunkFiles = rawModules.map(derivedModule => generateChunkFiles(config, compilerCtx, buildCtx, derivedModule));

    // ensure all the styles are done compiliing
    await buildCtx.stylesPromise;

    // Generate entry points for components. Each entry-point might emit several files
    // All different modes + scoped
    const entryPromises = buildCtx.entryModules.map(entry => generateBundleModesEntryModule(config, compilerCtx, rawModules, entry));

    // ensure all entries and chunks are finished
    await Promise.all([
      ...entryPromises,
      ...chunkFiles
    ]);
  }

  timeSpan.finish(`generate lazy bundles finished`);
}


async function generateBundleModesEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, rawModules: d.DerivedModule[], entryModule: d.EntryModule) {
  const mainModule = rawModules[0];
  const entryKey = entryModule.entryKey;
  const chunkIndex = mainModule.list.findIndex(c => c.entryKey === entryKey);

  if (chunkIndex >= 0) {
    entryModule.modeNames = entryModule.modeNames || [];

    const promises = entryModule.modeNames.map(async modeName => (
      await generateBundleMode(config, compilerCtx, entryModule, modeName, rawModules, chunkIndex)
    ));

    await Promise.all(promises);
  }
}


async function generateBundleMode(config: d.Config, _compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, modeName: string, rawModules: d.DerivedModule[], chunkIndex: number) {
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
        moduleFile.cmpCompilerMeta.bundleIds = moduleFile.cmpCompilerMeta.bundleIds || {};
        if (typeof moduleFile.cmpCompilerMeta.bundleIds === 'object') {
          moduleFile.cmpCompilerMeta.bundleIds[modeName] = bundleId;
        }
      });
    }

    // // generate the bundle build for mode, no scoped styles, and esm
    // if (module.isBrowser) {
    //   await generateBundleBrowserBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, module.sourceTarget);
    // } else {
    //   await generateBundleEsmBuild(config, compilerCtx, entryModule, jsText, bundleId, modeName, false, module.sourceTarget);
    // }

    // if (entryModule.requiresScopedStyles && config.buildScoped) {
    //   // create js text for: mode, scoped styles, esm
    //   const scopedJsText = await injectStyleMode(entryModule.moduleFiles, chunk.code, modeName, true);

    //   // generate the bundle build for: mode, esm and scoped styles
    //   if (module.isBrowser) {
    //     await generateBundleBrowserBuild(config, compilerCtx, entryModule, scopedJsText, bundleId, modeName, true, module.sourceTarget);
    //   } else {
    //     await generateBundleEsmBuild(config, compilerCtx, entryModule, scopedJsText, bundleId, modeName, true, module.sourceTarget);
    //   }
    // }
  });

  await Promise.all(promises);
}


function injectStyleMode(moduleFiles: d.Module[], jsText: string, modeName: string, isScopedStyles: boolean) {
  moduleFiles.forEach(moduleFile => {
    jsText = injectComponentStyleMode(moduleFile.cmpCompilerMeta, modeName, jsText, isScopedStyles);
  });

  return jsText;
}


export function injectComponentStyleMode(cmpMeta: d.ComponentCompilerMeta, modeName: string, jsText: string, isScopedStyles: boolean) {
  if (typeof jsText !== 'string') {
    return '';
  }

  const stylePlaceholder = getStylePlaceholder(cmpMeta.tagName);
  const stylePlaceholderId = getStyleIdPlaceholder(cmpMeta.tagName);

  let styleText = '';

  if (cmpMeta.styles.length > 0) {
    let modeStyles = cmpMeta.styles.find(s => s.modeName === modeName);
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
      modeStyles = cmpMeta.styles.find(s => s.modeName === DEFAULT_STYLE_MODE);
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

export function setBundleModeIds(moduleFiles: d.Module[], modeName: string, bundleId: string) {
  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  moduleFiles.forEach(moduleFile => {
    moduleFile.cmpCompilerMeta.bundleIds = moduleFile.cmpCompilerMeta.bundleIds || {};
    if (typeof moduleFile.cmpCompilerMeta.bundleIds === 'object') {
      moduleFile.cmpCompilerMeta.bundleIds[modeName] = bundleId;
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

      if (a.cmpCompilerMeta.tagName < b.cmpCompilerMeta.tagName) return -1;
      if (a.cmpCompilerMeta.tagName > b.cmpCompilerMeta.tagName) return 1;
      return 0;
    })
    .map(m => m.cmpCompilerMeta.tagName);

  if (modeName === DEFAULT_STYLE_MODE || !modeName) {
    return tags[0];
  }

  return `${tags[0]}.${modeName}`;
}


function canSkipGenerateBundles(buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
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



// async function generateBundleBrowserBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget: d.SourceTarget) {
//   // create the file name
//   const fileName = getBrowserFilename(bundleId, isScopedStyles, sourceTarget);

//   // update the bundle id placeholder with the actual bundle id
//   // this is used by jsonp callbacks to know which bundle loaded
//   jsText = replaceBundleIdPlaceholder(jsText, bundleId);

//   const entryBundle: d.EntryBundle = {
//     fileName: fileName,
//     text: jsText,
//     outputs: [],
//     modeName: modeName,
//     sourceTarget: sourceTarget,
//     isScopedStyles: isScopedStyles
//   };

//   entryModule.entryBundles = entryModule.entryBundles || [];
//   entryModule.entryBundles.push(entryBundle);

//   const outputTargets = config.outputTargets.filter(outputTarget => {
//     return outputTarget.appBuild;
//   }) as d.OutputTargetBuild[];

//   await Promise.all(outputTargets.map(async outputTarget => {
//     // get the absolute path to where it'll be saved
//     const wwwBuildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

//     // write to the build
//     await compilerCtx.fs.writeFile(wwwBuildPath, jsText);
//     entryBundle.outputs.push(wwwBuildPath);
//   }));
// }


// async function generateBundleEsmBuild(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, jsText: string, bundleId: string, modeName: string, isScopedStyles: boolean, sourceTarget: d.SourceTarget) {
//   // create the file name
//   const fileName = getEsmFilename(bundleId, isScopedStyles);

//   // update the bundle id placeholder with the actual bundle id
//   // this is used by jsonp callbacks to know which bundle loaded
//   jsText = replaceBundleIdPlaceholder(jsText, bundleId);

//   const entryBundle: d.EntryBundle = {
//     fileName: fileName,
//     text: jsText,
//     outputs: [],
//     modeName: modeName,
//     sourceTarget: sourceTarget,
//     isScopedStyles: isScopedStyles
//   };

//   entryModule.entryBundles = entryModule.entryBundles || [];
//   entryModule.entryBundles.push(entryBundle);

//   const outputTargets = config.outputTargets.filter(o => o.type === 'dist') as OutputTargetDist[];

//   await Promise.all(outputTargets.map(async outputTarget => {
//     // get the absolute path to where it'll be saved
//     const esmBuildPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), fileName);

//     // write to the build
//     await compilerCtx.fs.writeFile(esmBuildPath, jsText);
//     entryBundle.outputs.push(esmBuildPath);
//   }));
// }
