import { BuildConfig, BuildContext, Bundle, Collection, CompileResults,
  Manifest, ModuleFileMeta } from '../interfaces';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { normalizePath, readFile } from '../util';
import { resolveFrom } from '../resolve-from';
import { validateDependentCollection, validateUserBundles } from '../validation';
import { parseManifest, serializeManifest } from './manifest-data';


export function loadDependentManifests(config: BuildConfig) {
  return Promise.all(config.collections.map(userInput => {
    const dependentCollection = validateDependentCollection(userInput);
    return loadDependentManifest(config, dependentCollection);
  }));
}


function loadDependentManifest(config: BuildConfig, dependentCollection: Collection) {
  const sys = config.sys;

  const dependentManifestFilePath = resolveFrom(sys, config.rootDir, dependentCollection.name);
  const dependentManifestDir = sys.path.dirname(dependentManifestFilePath);

  return readFile(sys, dependentManifestFilePath).then(dependentManifestJson => {
    const dependentManifest = parseManifest(config, dependentManifestDir, dependentManifestJson);

    return processDependentManifest(config.bundles, dependentCollection, dependentManifest);
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


export function mergeManifests(manifestPriorityList: Manifest[]): Manifest {
  const removedComponents: string[] = [];

  const m = manifestPriorityList.reduce((allData, collectionManifest) => {
    const bundles = (collectionManifest.bundles || []).map(bundle => {
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

  return m;
}


export function generateManifest(config: BuildConfig, ctx: BuildContext, compileResults: CompileResults) {
  const sys = config.sys;
  const logger = config.logger;

  // validate we're good to go
  validateUserBundles(config.bundles);

  // get the absolute path to the directory where the manifest will be saved
  const manifestDir = normalizePath(config.collectionDest);

  // create an absolute path to the actual manifest json file
  const manifestFilePath = normalizePath(sys.path.join(manifestDir, COLLECTION_MANIFEST_FILE_NAME));

  // create the single manifest we're going to fill up with data
  const manifest: Manifest = {
    components: [],
    bundles: []
  };

  // get all of the filenames of the compiled files
  const fileNames = Object.keys(compileResults.moduleFiles);
  const manifestModulesFiles: ModuleFileMeta[] = [];

  // loop through the compiled files and fill up the manifest w/ serialized component data
  fileNames.forEach(fileName => {
    const moduleFile = compileResults.moduleFiles[fileName];

    if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.tagNameMeta) {
      // this isn't a component, let's not add it to the manifest
      return;
    }

    const includeComponent = config.bundles.some(b => {
      return b.components.some(c => c === moduleFile.cmpMeta.tagNameMeta);
    });

    if (!includeComponent) {
      // looks like we shouldn't include this component
      // cuz it wasn't in any of the build config's bundles
      return;
    }

    // awesome, good to go, let's add it to the manifest's components
    manifest.components.push(moduleFile.cmpMeta);

    manifestModulesFiles.push(moduleFile);
  });

  if (config.generateCollection) {
    // if we're also generating the collection, then we want to
    // save this manifest as a json file to disk
    logger.debug(`manifest, serializeManifest: ${manifestFilePath}`);

    ctx.filesToWrite[manifestFilePath] = serializeManifest(config, manifestDir, manifestModulesFiles);
  }

  return manifest;
}
