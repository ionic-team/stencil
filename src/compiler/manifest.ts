import { BuildConfig, BuildContext, Collection, CompileResults, ComponentMeta, Manifest, Bundle, StyleMeta } from './interfaces';
import { COLLECTION_MANIFEST_FILE_NAME } from '../util/constants';
import { normalizePath } from './util';
import { readFile } from './util';
import { resolveFrom } from './resolve-from';
import { validateDependentCollection, validateUserBundles, validateManifestBundles } from './validation';


export function loadDependentManifests(buildConfig: BuildConfig) {
  return Promise.all(buildConfig.collections.map(userInput => {
    const collection = validateDependentCollection(userInput);
    return loadDependentManifest(buildConfig, collection);
  }));
}


function loadDependentManifest(buildConfig: BuildConfig, collection: Collection) {
  const sys = buildConfig.sys;

  const manifestJsonFilePath = resolveFrom(sys, buildConfig.rootDir, collection.name);

  const manifestDir = sys.path.dirname(manifestJsonFilePath);

  return readFile(sys, manifestJsonFilePath).then(manifestJsonContent => {
    return parseDependentManifest(buildConfig, manifestDir, manifestJsonContent);
  });
}


export function parseDependentManifest(buildConfig: BuildConfig, manifestDir: string, manifestJsonContent: string) {
  const manifest: Manifest = JSON.parse(manifestJsonContent);

  return updateManifestUrls(buildConfig, manifest, manifestDir);
}


export function updateManifestUrls(buildConfig: BuildConfig, manifest: Manifest, manifestDir: string): Manifest {
  const sys = buildConfig.sys;

  const components = (manifest.components || []).map((comp: ComponentMeta) => {
    const styleMeta = updateStyleUrls(buildConfig, comp.styleMeta, manifestDir);

    return {
      ...comp,
      styleMeta,
      componentUrl: normalizePath(sys.path.join(manifestDir, comp.componentUrl))
    };
  });

  return {
    ...manifest,
    components
  };
}


function updateStyleUrls(buildConfig: BuildConfig, styleMeta: StyleMeta, manifestDir: string): StyleMeta {
  const sys = buildConfig.sys;

  return Object.keys(styleMeta || {}).reduce((styleData: StyleMeta, styleMode: string) => {
    const style = styleMeta[styleMode];

    const styleUrls = style.styleUrls
      .map(styleUrl => normalizePath(sys.path.relative(buildConfig.collectionDest, sys.path.join(manifestDir, styleUrl))));

    styleData[styleMode] = {
      ...style,
      styleUrls
    };

    return styleData;
  }, <StyleMeta>{});
}


export function mergeManifests(manifestPriorityList: Manifest[]): Manifest {
  let removedComponents: string[] = [];

  return manifestPriorityList.reduce((allData: Manifest, collectionManifest: Manifest) => {
    const bundles = (collectionManifest.bundles || []).map((bundle: Bundle) => {
        const components = (bundle.components || []).filter(tag => removedComponents.indexOf(tag) === -1);

        components.forEach(tag => removedComponents.push(tag));

        return {
          ...bundle,
          components
        };
      })
      .filter((bundle: Bundle) => bundle.components.length !== 0);

    return {
      components: allData.components.concat(collectionManifest.components),
      bundles: allData.bundles.concat(bundles)
    };
  }, <Manifest>{ components: [], bundles: []});
}


export function generateManifest(buildConfig: BuildConfig, ctx: BuildContext, compileResults: CompileResults) {
  const manifest: Manifest = {
    components: [],
    bundles: []
  };

  const sys = buildConfig.sys;
  const logger = buildConfig.logger;

  logger.debug(`manifest, generateManifest, collectionDest: ${buildConfig.collectionDest}`);

  validateUserBundles(buildConfig.bundles);

  const fileNames = Object.keys(compileResults.moduleFiles);

  fileNames.forEach(fileName => {
    const f = compileResults.moduleFiles[fileName];

    if (!f.cmpMeta || !f.cmpMeta.tagNameMeta) return;

    let includeComponent = false;
    for (var i = 0; i < buildConfig.bundles.length; i++) {
      if (buildConfig.bundles[i].components.indexOf(f.cmpMeta.tagNameMeta) > -1) {
        includeComponent = true;
        break;
      }
    }

    if (!includeComponent) return;

    const cmpMeta: ComponentMeta = Object.assign({}, <any>f.cmpMeta);

    cmpMeta.componentClass = f.cmpClassName;
    cmpMeta.componentUrl = f.jsFilePath.replace(buildConfig.collectionDest + sys.path.sep, '');

    const componentDir = normalizePath(sys.path.dirname(cmpMeta.componentUrl));

    if (cmpMeta.styleMeta) {
      const modeNames = Object.keys(cmpMeta.styleMeta);

      modeNames.forEach(modeName => {
        const cmpMode = cmpMeta.styleMeta[modeName];
        if (cmpMode.parsedStyleUrls) {
          cmpMode.styleUrls = cmpMode.parsedStyleUrls.map(parsedStyleUrl => {
            return normalizePath(sys.path.join(componentDir, parsedStyleUrl));
          });
        }
      });
    }

    if (!cmpMeta.listenersMeta.length) {
      delete cmpMeta.listenersMeta;
    }

    if (!cmpMeta.methodsMeta.length) {
      delete cmpMeta.methodsMeta;
    }

    if (!cmpMeta.propsMeta.length) {
      delete cmpMeta.propsMeta;
    }

    if (!cmpMeta.propWillChangeMeta.length) {
      delete cmpMeta.propWillChangeMeta;
    }

    if (!cmpMeta.propDidChangeMeta.length) {
      delete cmpMeta.propDidChangeMeta;
    }

    // place property at the bottom
    const slotMeta = cmpMeta.slotMeta;
    delete cmpMeta.slotMeta;
    cmpMeta.slotMeta = slotMeta;

    const shadow = cmpMeta.isShadowMeta;
    delete cmpMeta.isShadowMeta;
    cmpMeta.isShadowMeta = shadow;

    manifest.components.push(cmpMeta);
  });

  manifest.bundles = (buildConfig.bundles && buildConfig.bundles.slice()) || [];

  validateManifestBundles(manifest);

  if (buildConfig.generateCollection) {
    const manifestFilePath = normalizePath(sys.path.join(buildConfig.collectionDest, COLLECTION_MANIFEST_FILE_NAME));
    const manifestJson = JSON.stringify(manifest, null, 2);

    logger.debug(`manifest, write: ${manifestFilePath}`);

    ctx.filesToWrite[manifestFilePath] = manifestJson;
  }

  return manifest;
}
