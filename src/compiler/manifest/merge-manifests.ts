import { Bundle, Manifest } from '../../util/interfaces';


export function mergeDependentManifests(appManifest: Manifest, dependentManifests: Manifest[]) {
  // the appManifest is the single source of manifest data
  // we need to merge what we've learned about the
  // dependent manifests into the one app manifest object

  dependentManifests.forEach(dependentManifest => {
    // concat the module files together
    concatModuleFiles(appManifest, dependentManifest);

    // update which components go in which bundles
    updateBundles(appManifest, dependentManifest);

    // add the dependent manfiest to the app manifests
    appManifest.dependentManifests.push(dependentManifest);
  });

  return appManifest;
}


function concatModuleFiles(appManifest: Manifest, dependentManifest: Manifest) {
  if (!Array.isArray(dependentManifest.modulesFiles)) return;

  // append any dependent manifest data onto the appManifest
  appManifest.modulesFiles = appManifest.modulesFiles.concat(dependentManifest.modulesFiles);
}


function updateBundles(appManifest: Manifest, dependentManifest: Manifest) {
  if (!Array.isArray(dependentManifest.modulesFiles) || !Array.isArray(dependentManifest.bundles)) return;

  // if any component is in the app's bundle config
  // then the user's bundle config takes priority over whatever
  // bundle the dependent manifest has the component in

  dependentManifest.bundles.forEach(dependentBundle => {
    // make a fresh copy
    const cleanedBundled: Bundle = {
      components: []
    };

    dependentBundle.components.forEach(dependentBundleComponentTag => {

      // check if this dependent component tag is already in the app config's bundle
      const componentInAppBundle = appManifest.bundles.some(b => {
        return b.components.indexOf(dependentBundleComponentTag) > -1;
      });

      if (!componentInAppBundle) {
        // so this component is NOT in the app's bundle already
        // so it's safe to keep it in the dependent bundle's component config
        cleanedBundled.components.push(dependentBundleComponentTag);
      }
    });

    if (dependentBundle.components.length) {
      // ok, so let's add the cleaned dependent bundle to the app manifest
      appManifest.bundles.push(cleanedBundled);
    }
  });
}
