import { BuildConfig, BuildContext, Manifest, ModuleFiles } from '../../util/interfaces';
import { catchError } from '../util';
import { loadDependentManifests } from './load-dependent-manifests';
import { mergeDependentManifests } from './merge-manifests';


export function generateAppManifest(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles) {
  // create the app manifest we're going to fill up with data
  // the data will be both the app's data, and the collections it depends on
  ctx.manifest = {
    modulesFiles: [],
    bundles: [],
    global: null,
    dependentManifests: []
  };

  return Promise.resolve().then(() => {
    // add the app's compiled components to the manifest
    addAppBundles(config, ctx.manifest);
    return addAppComponents(config, ctx.manifest, moduleFiles);

  }).then(() => {
    // load each of the manifests for each dependent collection
    return loadDependentManifests(config, ctx);

  }).then(dependentManifests => {
    // merge the loaded dependent manifests
    // into the app's manifest
    return mergeDependentManifests(ctx.manifest, dependentManifests);

  }).catch(err => {
    // ¯\_(ツ)_/¯
    catchError(ctx.diagnostics, err);

  });
}


export function addAppComponents(config: BuildConfig, manifest: Manifest, moduleFiles: ModuleFiles) {
  // get all of the filenames of the compiled files
  const filePaths = Object.keys(moduleFiles);

  // loop through the compiled files and fill up the manifest w/ component data
  filePaths.forEach(filePath => {
    const moduleFile = moduleFiles[filePath];

    if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.tagNameMeta) {
      // this isn't a component, let's not add it to the manifest
      return;
    }

    // see if this component tag shows up in any config's bundles
    const includeComponent = config.bundles.some(bundle => {
      return bundle.components.some(c => c === moduleFile.cmpMeta.tagNameMeta);
    });

    if (!includeComponent) {
      // looks like we shouldn't include this component
      // cuz it wasn't in any of the build config's bundles
      return;
    }

    // awesome, good to go, let's add it to the manifest's components
    manifest.modulesFiles.push(moduleFile);
  });
}


export function addAppBundles(config: BuildConfig, manifest: Manifest) {
  config.bundles.forEach(configBundle => {
    manifest.bundles.push({
      components: configBundle.components.slice(),
      priority: configBundle.priority
    });
  });
}
