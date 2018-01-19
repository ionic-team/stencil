import { Config, CompilerCtx, Bundle, ComponentMeta, ComponentRegistry, SourceTarget, ModuleFile, BuildCtx, JSModuleMap } from '../../util/interfaces';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { hasError, pathJoin, minifyJs } from '../util';
import { getAppDistDir, getAppWWWBuildDir, getBundleFilename } from '../app/app-file-naming';
import { getStylePlaceholder, getStyleIdPlaceholder, replaceBundleIdPlaceholder } from '../../util/data-serialize';
import { transpileToEs5 } from '../transpile/core-build';


export async function generateBundles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[], jsModules: JSModuleMap) {
  // both styles and modules are done bundling
  // combine the styles and modules together
  // generate the actual files to write
  const timeSpan = config.logger.createTimeSpan(`generate bundles started`);
  const bundleKeys: { [key: string]: string } = {};

  await Promise.all(
    bundles.map(async bundle => {
      const bundleKeyPath = `./${bundle.entryKey}.js`;
      bundleKeys[bundleKeyPath] = bundle.entryKey;

      return Promise.all(
        bundle.modeNames.map(async modeName => {
          const jsCode = Object.keys(jsModules).reduce((all, mType) => {
            return {
              ...all,
              [mType]: jsModules[mType][bundleKeyPath].code
            };
          }, {} as {[key: string]: string});

          return await generateBundleMode(config, compilerCtx, buildCtx, bundle, modeName, jsCode);
        })
      );
    })
  );

  Object.keys(jsModules).forEach(mType => {
    Object.entries(jsModules[mType])
      .filter(([key]) => !bundleKeys[key])
      .forEach(([key, value]) => {
        writeJSFile(config, compilerCtx, key, value.code);
      });
  });

  // create the registry of all the components
  const cmpRegistry = createComponentRegistry(bundles);

  timeSpan.finish(`generate bundles finished`);

  return cmpRegistry;
}

async function generateBundleMode(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle, modeName: string, jsCode: { [key: string]: string }) {

  // create js text for: mode, no scoped styles and esm
  let jsText = await createBundleJsText(config, compilerCtx, buildCtx, bundle, jsCode['esm'], modeName, false);

  // the only bundle id comes from mode, no scoped styles and esm
  const bundleId = getBundleId(config, bundle, modeName, jsText);

  // assign the bundle id build from the
  // mode, no scoped styles and esm to each of the components
  bundle.moduleFiles.forEach(moduleFile => {
    moduleFile.cmpMeta.bundleIds = moduleFile.cmpMeta.bundleIds || {};
    moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
  });

  // generate the bundle build for mode, no scoped styles, and esm
  generateBundleBuild(config, compilerCtx, jsText, bundleId, false);

  if (bundle.requiresScopedStyles) {
    // create js text for: mode, scoped styles, esm
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, bundle, jsCode['esm'], modeName, true);

    // generate the bundle build for: mode, esm and scoped styles
    generateBundleBuild(config, compilerCtx, jsText, bundleId, true);
  }

  if (config.buildEs5) {
    // create js text for: mode, no scoped styles, es5
    jsText = await createBundleJsText(config, compilerCtx, buildCtx, bundle, jsCode['es5'], modeName, false, 'es5');

    // generate the bundle build for: mode, no scoped styles and es5
    generateBundleBuild(config, compilerCtx, jsText, bundleId, false, 'es5');

    if (bundle.requiresScopedStyles) {
      // create js text for: mode, scoped styles, es5
      jsText = await createBundleJsText(config, compilerCtx, buildCtx, bundle, jsCode['es5'], modeName, true, 'es5');

      // generate the bundle build for: mode, es5 and scoped styles
      generateBundleBuild(config, compilerCtx, jsText, bundleId, true, 'es5');
    }
  }
}


async function createBundleJsText(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle, jsText: string, modeName: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {

  if (sourceTarget === 'es5') {
    // use legacy bundling with commonjs/jsonp modules
    // and transpile the build to es5
    return transpileEs5Bundle(compilerCtx, buildCtx, jsText);
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

  return injectStyleMode(bundle.moduleFiles, jsText, modeName, isScopedStyles);
}


function generateBundleBuild(config: Config, compilerCtx: CompilerCtx, jsText: string, bundleId: string, isScopedStyles: boolean, sourceTarget?: SourceTarget) {
  // create the file name
  const fileName = getBundleFilename(bundleId, isScopedStyles, sourceTarget);


  // update the bundle id placeholder with the actual bundle id
  // this is used by jsonp callbacks to know which bundle loaded
  jsText = replaceBundleIdPlaceholder(jsText, bundleId);

  writeJSFile(config, compilerCtx, fileName, jsText);
}


function writeJSFile(config: Config, compilerCtx: CompilerCtx, fileName: string, jsText: string) {

  // get the absolute path to where it'll be saved in www
  const wwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), fileName);

  // get the absolute path to where it'll be saved in dist
  const distPath = pathJoin(config, getAppDistDir(config), fileName);

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
    moduleFile.cmpMeta.bundleIds[modeName] = bundleId;
  });
}


export function getBundleId(config: Config, bundle: Bundle, modeName: string, jsText: string) {
  if (config.hashFileNames) {
    // create style id from hashing the content
    return config.sys.generateContentHash(jsText, config.hashedFileNameLength);
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

function createComponentRegistry(bundles: Bundle[]) {
  const registryComponents: ComponentMeta[] = [];
  const cmpRegistry: ComponentRegistry = {};

  return bundles
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
