import { BuildConfig, BuildContext, ComponentMeta, ComponentRegistry, ManifestBundle, ModuleFile, SourceTarget } from '../../util/interfaces';
import { bundleRequiresScopedStyles, getManifestBundleModes } from './bundle-styles';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { generatePreamble, hasError, pathJoin } from '../util';
import { getAppDistDir, getAppWWWBuildDir, getBundleFilename } from '../app/app-file-naming';
import { getStylePlaceholder, getStyleIdPlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { transpileToEs5 } from '../transpile/core-build';


export function generateBundles(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = config.logger.createTimeSpan(`generate bundles started`, true);

  manifestBundles.forEach(manifestBundle => {
    generateBundle(config, ctx, manifestBundle);
  });

  if (config.es5Fallback) {
    manifestBundles.forEach(manifestBundle => {
      generateBundle(config, ctx, manifestBundle, 'es5');
    });
  }

  // create the registry of all the components
  ctx.registry = generateComponentRegistry(manifestBundles);

  timeSpan.finish(`generate bundles finished`);
}


function generateBundle(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, sourceTarget?: SourceTarget) {
  // init the bundle id for each component in this bundle
  manifestBundle.moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
  });

  // get the already bundled js modules for this source target
  let jsText = getBundleJsText(ctx, manifestBundle, sourceTarget);

  if (config.minifyJs) {
    // minify the bundle js text
    jsText = minifyBundleJs(config, ctx, jsText, sourceTarget);
  }

  // create unscoped css bundles
  generateBundleModes(config, ctx, manifestBundle, jsText, false, sourceTarget);

  if (bundleRequiresScopedStyles(manifestBundle.moduleFiles)) {
    // create scoped css bundles
    generateBundleModes(config, ctx, manifestBundle, jsText, true, sourceTarget);
  }
}


function generateBundleModes(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, jsText: string, isScopedCss: boolean, sourceTarget?: SourceTarget) {
  // get all the possible modes used within this bundle
  // reverse source so the default style mode is taken care of last
  const modeNames = getManifestBundleModes(manifestBundle.moduleFiles).reverse();

  if (modeNames.length) {
    modeNames.forEach(modeName => {
      jsText = injectStyleModes(manifestBundle, modeName, jsText, isScopedCss);

      if (modeName !== DEFAULT_STYLE_MODE) {
        // possible that most components in a bundle has styles for a mode
        // but one of the components doesn't, so we need to inject the default
        // for this bundle. Think grouping ion-fixed, that has no mode styles,
        // but it's being bundled with ion-button, which does.
        jsText = injectStyleModes(manifestBundle, DEFAULT_STYLE_MODE, jsText, isScopedCss);
      }

      generateBundleMode(config, ctx, manifestBundle, jsText, modeName, isScopedCss, sourceTarget);
    });

  } else {
    // this bundle doesn't have any modes, so go with the default
    jsText = injectStyleModes(manifestBundle, DEFAULT_STYLE_MODE, jsText, isScopedCss);
    generateBundleMode(config, ctx, manifestBundle, jsText, DEFAULT_STYLE_MODE, isScopedCss, sourceTarget);
  }
}


function generateBundleMode(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle, jsText: string, modeName: string, isScopedCss: boolean, sourceTarget?: SourceTarget) {
  // create the bundle id
  manifestBundle.bundleId = getBundleId(config, manifestBundle, modeName, jsText, isScopedCss, sourceTarget);

  // assign the bundle id to each of the components
  setBundleModeIds(manifestBundle.moduleFiles, modeName, manifestBundle.bundleId, sourceTarget);

  // create the file name
  const fileName = getBundleFilename(manifestBundle.bundleId);

  // get the absolute path to where it'll be saved in www
  const wwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), fileName);

  // get the absolute path to where it'll be saved in dist
  const distPath = pathJoin(config, getAppDistDir(config), fileName);

  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, manifestBundle.bundleId);

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


function injectStyleModes(manifestBundle: ManifestBundle, modeName: string, jsText: string, isScopedCss: boolean) {
  manifestBundle.moduleFiles.forEach(moduleFile => {
    jsText = injectComponentStyleMode(moduleFile.cmpMeta, modeName, jsText, isScopedCss);
  });

  return jsText;
}


function injectComponentStyleMode(cmpMeta: ComponentMeta, modeName: string, jsText: string, isScopedCss: boolean) {
  const modeStyles = cmpMeta.stylesMeta[modeName];

  if (modeStyles) {
    let styleText: string;
    if (isScopedCss) {
      // we specifically want scoped css
      styleText = modeStyles.compiledStyleTextScoped;
    }
    if (!styleText) {
      // either we don't want scoped css
      // or we DO want scoped css, but we don't have any
      // use the un-scoped css
      styleText = modeStyles.compiledStyleText || '';
    }

    // replace the style placeholder string that's already in the js text
    const stylePlaceholder = getStylePlaceholder(cmpMeta.tagNameMeta);
    jsText = jsText.replace(stylePlaceholder, styleText);

    // replace the style id placeholder string that's already in the js text
    const stylePlaceholderId = getStyleIdPlaceholder(cmpMeta.tagNameMeta);
    jsText = jsText.replace(stylePlaceholderId, modeName);
  }

  // return the js text with the newly inject style
  return jsText;
}


function getBundleJsText(ctx: BuildContext, manifestBundle: ManifestBundle, sourceTarget?: SourceTarget) {
  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    return transileEs5Bundle(ctx, manifestBundle.compiledModuleLegacyText);
  }

  // already have es modules with es6 target
  return manifestBundle.compiledModuleText;
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


export function getBundleId(config: BuildConfig, manifestBundle: ManifestBundle, modeName: string, jsText: string, isScopedCss?: boolean, sourceTarget?: SourceTarget) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return getBundleIdHashed(config, jsText);
  }

  const tags = manifestBundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta);
  return getBundleIdDev(tags, modeName, isScopedCss, sourceTarget);
}


export function getBundleIdHashed(config: BuildConfig, jsText: string) {
  return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
}


export function getBundleIdDev(tags: string[], modeName: string, isScopedCss: boolean, sourceTarget?: SourceTarget) {
  let bundleId: string;
  tags = tags.sort();

  if (modeName === DEFAULT_STYLE_MODE || !modeName) {
    bundleId = tags[0];
  } else {
    bundleId = `${tags[0]}.${modeName}`;
  }

  return `${bundleId}${isScopedCss ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}`;
}


export function setBundleModeIds(moduleFiles: ModuleFile[], modeName: string, bundleId: string, sourceTarget?: SourceTarget) {
  moduleFiles.forEach(moduleFile => {
    if (modeName) {
      moduleFile.cmpMeta.bundleIds[modeName] = moduleFile.cmpMeta.bundleIds[modeName] || {};
      if (sourceTarget === 'es5') {
        moduleFile.cmpMeta.bundleIds[modeName].es5 = bundleId;
      } else {
        moduleFile.cmpMeta.bundleIds[modeName].es2015 = bundleId;
      }

    } else {
      moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE] = moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE] || {};
      if (sourceTarget === 'es5') {
        moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE].es5 = bundleId;
      } else {
        moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE].es2015 = bundleId;
      }
    }

  });
}

export function generateComponentRegistry(manifestBundles: ManifestBundle[]) {
  const registryComponents: ComponentMeta[] = [];
  const registry: ComponentRegistry = {};

  manifestBundles.forEach(manifestBundle => {
    manifestBundle.moduleFiles.filter(m => m.cmpMeta).forEach(moduleFile => {
      registryComponents.push(moduleFile.cmpMeta);
    });
  });

  registryComponents.sort((a, b) => {
    if (a.tagNameMeta < b.tagNameMeta) return -1;
    if (a.tagNameMeta > b.tagNameMeta) return 1;
    return 0;

  }).forEach(cmpMeta => {
    registry[cmpMeta.tagNameMeta] = cmpMeta;
  });

  return registry;
}
