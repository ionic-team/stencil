import { BuildConfig, BuildContext, Manifest, ModuleFiles } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { loadDependentManifests } from './load-dependent-manifests';
import { mergeDependentManifests } from './merge-manifests';


export function generateAppManifest(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles) {
  // create the app manifest we're going to fill up with data
  // the data will be both the app's data, and the collections it depends on
  ctx.manifest = {
    modulesFiles: [],
    bundles: [],
    global: null,
    dependentManifests: [],
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    }
  };

  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

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
    const includedComponent = config.bundles.some(bundle => {
      return bundle.components.some(c => c === moduleFile.cmpMeta.tagNameMeta);
    });

    if (!includedComponent) {
      // didn't find this component in the config bundles
      // so let's go ahead and just add it for them
      manifest.bundles.push({
        components: [moduleFile.cmpMeta.tagNameMeta]
      });
    }

    // awesome, good to go, let's add it to the manifest's components
    manifest.modulesFiles.push(moduleFile);
  });
}


export function addAppBundles(config: BuildConfig, manifest: Manifest) {
  config.bundles.forEach(configBundle => {
    manifest.bundles.push({
      components: configBundle.components.slice()
    });
  });
}
