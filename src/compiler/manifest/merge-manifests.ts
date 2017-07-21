import { Bundle, Manifest } from '../../util/interfaces';


export function mergeDependentManifests(projectManifest: Manifest, dependentManifests: Manifest[]) {
  // the projectManifest is the single source of manifest data
  // we need to merge what we've learned about the
  // dependent manifests into the one project manifest object

  dependentManifests.forEach(dependentManifest => {
    // concat the module files together
    concatModuleFiles(projectManifest, dependentManifest);

    // update which components go in which bundles
    updateBundles(projectManifest, dependentManifest);

    // add the dependent manfiest to the project manifests
    projectManifest.dependentManifests.push(dependentManifest);
  });

  return projectManifest;
}


function concatModuleFiles(projectManifest: Manifest, dependentManifest: Manifest) {
  if (!Array.isArray(dependentManifest.modulesFiles)) return;

  // append any dependent manifest data onto the projectManifest
  projectManifest.modulesFiles = projectManifest.modulesFiles.concat(dependentManifest.modulesFiles);
}


function updateBundles(projectManifest: Manifest, dependentManifest: Manifest) {
  if (!Array.isArray(dependentManifest.modulesFiles) || !Array.isArray(dependentManifest.bundles)) return;

  // if any component is in the project's bundle config
  // then the user's bundle config takes priority over whatever
  // bundle the dependent manifest has the component in

  dependentManifest.bundles.forEach(dependentBundle => {
    // make a fresh copy
    const cleanedBundled: Bundle = {
      components: [],
      priority: dependentBundle.priority
    };

    dependentBundle.components.forEach(dependentBundleComponentTag => {

      // check if this dependent component tag is already in the project config's bundle
      const componentInProjectBundle = projectManifest.bundles.some(b => {
        return b.components.indexOf(dependentBundleComponentTag) > -1;
      });

      if (!componentInProjectBundle) {
        // so this component is NOT in the project's bundle already
        // so it's safe to keep it in the dependent bundle's component config
        cleanedBundled.components.push(dependentBundleComponentTag);
      }
    });

    if (dependentBundle.components.length) {
      // ok, so let's add the cleaned dependent bundle to the project manifest
      projectManifest.bundles.push(cleanedBundled);
    }
  });
}
