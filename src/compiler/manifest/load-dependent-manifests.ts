import { BuildConfig, BuildContext, Bundle, DependentCollection, Manifest } from '../../util/interfaces';
import { normalizePath, readFile } from '../util';
import { parseDependentManifest } from './manifest-data';


export function loadDependentManifests(config: BuildConfig, ctx: BuildContext) {
  // load up all of the collections which this app is dependent on
  return Promise.all(config.collections.map(configCollection => {
    return loadDependentManifest(config, ctx, configCollection);
  }));
}


function loadDependentManifest(config: BuildConfig, ctx: BuildContext, dependentCollection: DependentCollection) {

  if (ctx.dependentManifests[dependentCollection.name]) {
    // we've already cached the manifest, no need for another resolve/readFile/parse
    return Promise.resolve(ctx.dependentManifests[dependentCollection.name]);
  }

  // figure out the full path to the collection manifest file
  const dependentManifestFilePath = normalizePath(
    config.sys.resolveModule(config.rootDir, dependentCollection.name)
  );

  // we haven't cached the dependent manifest yet, let's read this file
  return readFile(config.sys, dependentManifestFilePath).then(dependentManifestJson => {
    // get the directory where the collection manifest file is sitting
    const dependentManifestDir = normalizePath(config.sys.path.dirname(dependentManifestFilePath));

    // parse the json string into our Manifest data
    const dependentManifest = parseDependentManifest(config, dependentCollection.name, dependentManifestDir, dependentManifestJson);

    // go through and filter out components if need be
    filterDependentComponents(config.bundles, dependentCollection, dependentManifest);

    // cache it for later yo
    ctx.dependentManifests[dependentCollection.name] = dependentManifest;

    // so let's recap: we've read the file, parsed it apart, and cached it, congrats
    return dependentManifest;
  });
}


export function filterDependentComponents(bundles: Bundle[], dependentCollection: DependentCollection, dependentManifest: Manifest) {
  if (dependentCollection.includeBundledOnly) {
    // what was imported included every component this collection has
    // however, the user only want to include specific components
    // which are seen within the user's own bundles
    // loop through this manifest an take out components which are not
    // seen in the user's list of bundled components
    dependentManifest.modulesFiles = dependentManifest.modulesFiles.filter(modulesFile => {
      return bundles.some(b => b.components.indexOf(modulesFile.cmpMeta.tagNameMeta) > -1);
    });
  }
}
