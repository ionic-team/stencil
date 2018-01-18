import { Config, CompilerCtx, Bundle, ComponentMeta, ComponentRegistry, SourceTarget, ModuleFile, BuildCtx } from '../../util/interfaces';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { hasError, pathJoin, minifyJs } from '../util';
import { getAppDistDir, getAppWWWBuildDir, getBundleFilename } from '../app/app-file-naming';
import { getStylePlaceholder, getStyleIdPlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { transpileToEs5 } from '../transpile/core-build';


export function generateBundles(config: Config, comilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[]) {
  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = config.logger.createTimeSpan(`generate bundles started`);

  bundles.forEach(bundle => {
    generateBundle(config, comilerCtx, buildCtx, bundle);
  });

  // create the registry of all the components
  const cmpRegistry = generateComponentRegistry(bundles);

  timeSpan.finish(`generate bundles finished`);

  return cmpRegistry;
}


function generateBundle(config: Config, comilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle) {
  bundle.modeNames.forEach(modeName => {
    generateBundleMode(config, comilerCtx, buildCtx, bundle, modeName);
  });
}


async function generateBundleMode(config: Config, comilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle, modeName: string) {
  // create js text for: mode, no scoped styles and esm
  let jsText = await createBundleJsText(config, comilerCtx, buildCtx, bundle, modeName, false);

  // the only bundle id comes from mode, no scoped styles and esm
  const bundleId = getBundleId(config, bundle, modeName, jsText);

  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  setBundleModeIds(bundle.moduleFiles, modeName, bundleId);

  // generate the bundle build for mode, no scoped styles, and esm
  generateBundleBuild(config, comilerCtx, jsText, bundleId, false);

  if (bundle.requiresScopedStyles) {
    // create js text for: mode, scoped styles, esm
    jsText = await createBundleJsText(config, comilerCtx, buildCtx, bundle, modeName, true);

    // generate the bundle build for: mode, esm and scoped styles
    generateBundleBuild(config, comilerCtx, jsText, bundleId, true);
  }

  if (config.buildEs5) {
    // create js text for: mode, no scoped styles, es5
    jsText = await createBundleJsText(config, comilerCtx, buildCtx, bundle, modeName, false, 'es5');

    // generate the bundle build for: mode, no scoped styles and es5
    generateBundleBuild(config, comilerCtx, jsText, bundleId, false, 'es5');

    if (bundle.requiresScopedStyles) {
      // create js text for: mode, scoped styles, es5
      jsText = await createBundleJsText(config, comilerCtx, buildCtx, bundle, modeName, true, 'es5');

      // generate the bundle build for: mode, es5 and scoped styles
      generateBundleBuild(config, comilerCtx, jsText, bundleId, true, 'es5');
    }
  }
}


async function createBundleJsText(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle, modeName: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // get the already bundled js module text
  let jsText = await getBundleJsText(compilerCtx, buildCtx, bundle, sourceTarget);

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

  return injectStyleMode(bundle.moduleFiles, jsText, modeName, isScopedStyles);
}


function generateBundleBuild(config: Config, compilerCtx: CompilerCtx, jsText: string, bundleId: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // create the file name
  const fileName = getBundleFilename(bundleId, isScopedStyles, sourceTarget);

  // get the absolute path to where it'll be saved in www
  const wwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), fileName);

  // get the absolute path to where it'll be saved in dist
  const distPath = pathJoin(config, getAppDistDir(config), fileName);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  if (config.generateWWW) {
    // write to the www build
    compilerCtx.fs.writeFile(wwwBuildPath, jsText);
  }

  if (config.generateDistribution) {
    // write to the dist build
    compilerCtx.fs.writeFile(distPath, jsText);
  }
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


async function getBundleJsText(compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle, sourceTarget?: SourceTarget) {
  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    return transileEs5Bundle(compilerCtx, buildCtx, bundle.compiledModuleLegacyJsText);
  }

  // already have es modules with es6 target
  return bundle.compiledModuleJsText;
}


async function transileEs5Bundle(compilerCtx: CompilerCtx, buildCtx: BuildCtx, jsText: string) {
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
    moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
  });
}


export function getBundleId(config: Config, bundle: Bundle, modeName: string, jsText: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return getBundleIdHashed(config, jsText);
  }

  const tags = bundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta);
  return getBundleIdDev(tags, modeName);
}


export function getBundleIdHashed(config: Config, jsText: string) {
  return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
}


export function getBundleIdDev(tags: string[], modeName: string) {
  tags = tags.sort();

  if (modeName === DEFAULT_STYLE_MODE || !modeName) {
    return tags[0];
  }

  return `${tags[0]}.${modeName}`;
}


export function generateComponentRegistry(bundles: Bundle[]) {
  const registryComponents: ComponentMeta[] = [];
  const cmpRegistry: ComponentRegistry = {};

  bundles.forEach(bundle => {
    bundle.moduleFiles.filter(m => m.cmpMeta).forEach(moduleFile => {
      registryComponents.push(moduleFile.cmpMeta);
    });
  });

  registryComponents.sort((a, b) => {
    if (a.tagNameMeta < b.tagNameMeta) return -1;
    if (a.tagNameMeta > b.tagNameMeta) return 1;
    return 0;

  }).forEach(cmpMeta => {
    cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
  });

  return cmpRegistry;
}
