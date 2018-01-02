import { BuildConfig, BuildContext, Bundle, ComponentMeta, ComponentRegistry, SourceTarget, ModuleFile } from '../../util/interfaces';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { generatePreamble, hasError, pathJoin } from '../util';
import { getAppDistDir, getAppWWWBuildDir, getBundleFilename } from '../app/app-file-naming';
import { getStylePlaceholder, getStyleIdPlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { transpileToEs5 } from '../transpile/core-build';


export function generateBundles(config: BuildConfig, ctx: BuildContext, bundles: Bundle[]) {
  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = config.logger.createTimeSpan(`generate bundles started`, true);

  bundles.forEach(bundle => {
    generateBundle(config, ctx, bundle);
  });

  // create the registry of all the components
  const cmpRegistry = generateComponentRegistry(bundles);

  timeSpan.finish(`generate bundles finished`);

  return cmpRegistry;
}


function generateBundle(config: BuildConfig, ctx: BuildContext, bundle: Bundle) {
  bundle.modeNames.forEach(modeName => {
    generateBundleMode(config, ctx, bundle, modeName);
  });
}


function generateBundleMode(config: BuildConfig, ctx: BuildContext, bundle: Bundle, modeName: string) {
  // create js text for: mode, no scoped styles and esm
  let jsText = createBundleJsText(config, ctx, bundle, modeName, false);

  // the only bundle id comes from mode, no scoped styles and esm
  const bundleId = getBundleId(config, bundle, modeName, jsText);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  setBundleModeIds(bundle.moduleFiles, modeName, bundleId);

  // generate the bundle build for mode, no scoped styles, and esm
  generateBundleBuild(config, ctx, jsText, bundleId, false);

  if (bundle.requiresScopedStyles) {
    // create js text for: mode, scoped styles, esm
    jsText = createBundleJsText(config, ctx, bundle, modeName, true);

    // generate the bundle build for: mode, esm and scoped styles
    generateBundleBuild(config, ctx, jsText, bundleId, true);
  }

  if (config.buildEs5) {
    // create js text for: mode, no scoped styles, es5
    jsText = createBundleJsText(config, ctx, bundle, modeName, false, 'es5');

    // generate the bundle build for: mode, no scoped styles and es5
    generateBundleBuild(config, ctx, jsText, bundleId, false, 'es5');

    if (bundle.requiresScopedStyles) {
      // create js text for: mode, scoped styles, es5
      jsText = createBundleJsText(config, ctx, bundle, modeName, true, 'es5');

      // generate the bundle build for: mode, es5 and scoped styles
      generateBundleBuild(config, ctx, jsText, bundleId, true, 'es5');
    }
  }
}


function createBundleJsText(config: BuildConfig, ctx: BuildContext, bundle: Bundle, modeName: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // get the already bundled js module text
  let jsText = getBundleJsText(ctx, bundle, sourceTarget);

  if (config.minifyJs) {
    // minify the bundle js text
    jsText = minifyBundleJs(config, ctx, jsText, sourceTarget);
  }

  return injectStyleMode(bundle.moduleFiles, jsText, modeName, isScopedStyles);
}


function generateBundleBuild(config: BuildConfig, ctx: BuildContext, jsText: string, bundleId: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // create the file name
  const fileName = getBundleFilename(bundleId, isScopedStyles, sourceTarget);

  // get the absolute path to where it'll be saved in www
  const wwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), fileName);

  // get the absolute path to where it'll be saved in dist
  const distPath = pathJoin(config, getAppDistDir(config), fileName);

  // use wwwBuildPath as the cache key
  if (ctx.compiledFileCache[wwwBuildPath] === jsText) {
    // unchanged, no need to resave
    return;
  }

  // cache for later
  ctx.compiledFileCache[wwwBuildPath] = jsText;

  if (config.generateWWW) {
    // write to the www build
    ctx.filesToWrite[wwwBuildPath] = jsText;
  }

  if (config.generateDistribution) {
    // write to the dist build
    ctx.filesToWrite[distPath] = jsText;
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


function getBundleJsText(ctx: BuildContext, bundle: Bundle, sourceTarget?: SourceTarget) {
  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    return transileEs5Bundle(ctx, bundle.compiledModuleLegacyText);
  }

  // already have es modules with es6 target
  return bundle.compiledModuleText;
}


function transileEs5Bundle(ctx: BuildContext, jsText: string) {
  // use typescript to convert this js text into es5
  const transpileResults = transpileToEs5(jsText);
  if (transpileResults.diagnostics && transpileResults.diagnostics.length > 0) {
    ctx.diagnostics.push(...transpileResults.diagnostics);
  }
  if (hasError(transpileResults.diagnostics)) {
    return jsText;
  }
  return transpileResults.code;
}


function minifyBundleJs(config: BuildConfig, ctx: BuildContext, jsText: string, sourceTarget?: SourceTarget) {
  const opts: any = { output: {}, compress: {}, mangle: {} };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;

  } else {
    opts.ecma = 6;
    opts.output.ecma = 6;
    opts.compress.ecma = 6;
    opts.compress.arrows = true;
  }

  if (config.logLevel === 'debug') {
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.bracketize = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
    opts.output.preserve_line = true;
  }

  opts.output.preamble = generatePreamble(config);

  const minifyJsResults = config.sys.minifyJs(jsText, opts);

  if (minifyJsResults.diagnostics.length) {
    minifyJsResults.diagnostics.forEach(d => {
      ctx.diagnostics.push(d);
    });

  } else {
    jsText = minifyJsResults.output;
  }

  return jsText;
}


export function setBundleModeIds(moduleFiles: ModuleFile[], modeName: string, bundleId: string) {
  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
    moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
  });
}


export function getBundleId(config: BuildConfig, bundle: Bundle, modeName: string, jsText: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return getBundleIdHashed(config, jsText);
  }

  const tags = bundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta);
  return getBundleIdDev(tags, modeName);
}


export function getBundleIdHashed(config: BuildConfig, jsText: string) {
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
