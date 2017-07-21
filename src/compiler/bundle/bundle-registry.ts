import { ComponentRegistry, Manifest, ModuleResults, StylesResults } from '../../util/interfaces';


export function generateComponentRegistry(manifest: Manifest, styleResults: StylesResults, moduleResults: ModuleResults) {
  const registry: ComponentRegistry = {};

  // create the minimal registry component data for each bundle
  Object.keys(styleResults.bundles).forEach(bundleId => {
    // a bundle id is made of of each component tag name
    // separated by a period
    const componentTags = bundleId.split('.');
    const styleResult = styleResults.bundles[bundleId];

    componentTags.forEach(tag => {
      const registryTag = tag.toUpperCase();

      // merge up the style id to the style data
      if (!registry[registryTag]) {
        registry[registryTag] = manifest.modulesFiles.find(modulesFile => {
          return modulesFile.cmpMeta.tagNameMeta === tag;
        }).cmpMeta;
      }

      if (registry[registryTag]) {
        registry[registryTag].stylesMeta = registry[registryTag].stylesMeta || {};

        if (styleResult) {
          Object.keys(styleResult).forEach(modeName => {
            registry[registryTag].stylesMeta[modeName] = registry[registryTag].stylesMeta[modeName] || {};
            registry[registryTag].stylesMeta[modeName].styleId = styleResult[modeName];
          });
        }
      }
    });
  });

  Object.keys(moduleResults.bundles).forEach(bundleId => {
    const componentTags = bundleId.split('.');
    const moduleId = moduleResults.bundles[bundleId];

    componentTags.forEach(tag => {
      const registryTag = tag.toUpperCase();

      if (!registry[registryTag]) {
        registry[registryTag] = manifest.modulesFiles.find(modulesFile => {
          return modulesFile.cmpMeta.tagNameMeta === tag;
        }).cmpMeta;
      }

      if (registry[registryTag]) {
        registry[registryTag].moduleId = moduleId;
      }
    });
  });

  return registry;
  // return formatComponentRegistry(registry, config.attrCase);
}
