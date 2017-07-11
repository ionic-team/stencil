import { BuildConfig, BuildContext, Bundle, Collection, CompileResults, ComponentMeta, Manifest, ModuleFileMeta, StyleMeta, StencilSystem } from './interfaces';
import { COLLECTION_MANIFEST_FILE_NAME } from '../util/constants';
import { normalizePath } from './util';
import { readFile } from './util';
import { resolveFrom } from './resolve-from';
import { validateDependentCollection, validateUserBundles, validateManifestBundles } from './validation';


export function loadDependentManifests(buildConfig: BuildConfig) {
  return Promise.all(buildConfig.collections.map(userInput => {
    const dependentCollection = validateDependentCollection(userInput);
    return loadDependentManifest(buildConfig, dependentCollection);
  }));
}


function loadDependentManifest(buildConfig: BuildConfig, dependentCollection: Collection) {
  const sys = buildConfig.sys;

  const dependentManifestFilePath = resolveFrom(sys, buildConfig.rootDir, dependentCollection.name);
  const dependentManifestDir = sys.path.dirname(dependentManifestFilePath);

  return readFile(sys, dependentManifestFilePath).then(dependentManifestJson => {
    let dependentManifest: Manifest = JSON.parse(dependentManifestJson);

    dependentManifest = processDependentManifest(buildConfig.bundles, dependentCollection, dependentManifest);

    return parseDependentManifest(buildConfig, dependentManifest, dependentManifestDir);
  });
}


export function processDependentManifest(bundles: Bundle[], dependentCollection: Collection, dependentManifest: Manifest) {
  if (dependentCollection.includeBundledOnly) {
    // what was imported included every component this collection has
    // however, the user only want to include specific components
    // which are seen within their own bundles
    // loop through this manifest an take out components which are not
    // seen in the user's list of bundled components
    dependentManifest.components = dependentManifest.components.filter(c => {
      return bundles.some(b => b.components.indexOf(c.tagNameMeta) > -1);
    });
  }

  return dependentManifest;
}


export function parseDependentManifest(buildConfig: BuildConfig, dependentManifest: Manifest, dependentManifestDir: string) {


  return updateManifestUrls(buildConfig, dependentManifest, dependentManifestDir);
}


export function updateManifestUrls(buildConfig: BuildConfig, dependentManifest: Manifest, dependentManifestDir: string): Manifest {
  const sys = buildConfig.sys;

  const components = (dependentManifest.components || []).map((comp: ComponentMeta) => {
    dependentManifestDir = normalizePath(dependentManifestDir);
    comp.componentUrl = normalizePath(comp.componentUrl);

    const styleMeta = updateStyleUrls(buildConfig, comp.styleMeta, dependentManifestDir);

    return {
      ...comp,
      styleMeta,
      componentUrl: normalizePath(sys.path.join(dependentManifestDir, comp.componentUrl))
    };
  });

  return {
    ...dependentManifest,
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

  const manifestFilePath = normalizePath(sys.path.join(buildConfig.collectionDest, COLLECTION_MANIFEST_FILE_NAME));

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

    convertManifestUrlToRelative(buildConfig.sys, buildConfig.collectionDest, f, cmpMeta);

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
    logger.debug(`manifest, generateManifest: ${manifestFilePath}`);

    ctx.filesToWrite[manifestFilePath] = JSON.stringify(manifest, null, 2);
  }

  return manifest;
}


export function convertManifestUrlToRelative(sys: StencilSystem, collectionDest: string, moduleFile: ModuleFileMeta, cmpMeta: ComponentMeta) {
  const jsFilePath = normalizePath(moduleFile.jsFilePath);
  collectionDest = normalizePath(collectionDest);

  cmpMeta.componentUrl = normalizePath(sys.path.relative(collectionDest, jsFilePath));

  const componentDir = normalizePath(sys.path.dirname(cmpMeta.componentUrl));

  if (cmpMeta.styleMeta) {
    cmpMeta.styleMeta = Object.assign({}, cmpMeta.styleMeta);

    const modeNames = Object.keys(cmpMeta.styleMeta);

    modeNames.forEach(modeName => {
      const cmpMode = cmpMeta.styleMeta[modeName];

      if (cmpMode.parsedStyleUrls) {
        cmpMode.styleUrls = cmpMode.parsedStyleUrls.map(parsedStyleUrl => {
          parsedStyleUrl = normalizePath(parsedStyleUrl);

          return sys.path.join(componentDir, parsedStyleUrl);
        });
      }
    });
  }
}
