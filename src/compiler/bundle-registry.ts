import { BuildConfig, ComponentRegistry, Manifest, ModuleResults,
  LoadComponentRegistry, StylesResults } from './interfaces';
import { formatComponentRegistry } from '../util/data-serialize';


export function generateComponentRegistry(config: BuildConfig, manifest: Manifest, styleResults: StylesResults, moduleResults: ModuleResults): LoadComponentRegistry[] {
  const registry: ComponentRegistry = {};

  // create the minimal registry component data for each bundle
  Object.keys(styleResults.bundles).forEach(bundleId => {
    // a bundle id is made of of each component tag name
    // separated by a period
    const components = bundleId.split('.');
    const styleResult = styleResults.bundles[bundleId];

    components.forEach(tag => {
      // merge up the style id to the style data
      registry[tag] = registry[tag] || manifest.components.find(c => c.tagNameMeta === tag);
      if (registry[tag]) {
        registry[tag].stylesMeta = registry[tag].stylesMeta || {};

        if (styleResult) {
          Object.keys(styleResult).forEach(modeName => {
            registry[tag].stylesMeta[modeName] = registry[tag].stylesMeta[modeName] || {};
            registry[tag].stylesMeta[modeName].styleId = styleResult[modeName];
          });
        }
      }
    });
  });


  Object.keys(moduleResults.bundles).forEach(bundleId => {
    const components = bundleId.split('.');
    const moduleId = moduleResults.bundles[bundleId];

    components.forEach(tag => {
      registry[tag] = registry[tag] || manifest.components.find(c => c.tagNameMeta === tag);
      if (registry[tag]) {
        registry[tag].moduleId = moduleId;
      }
    });
  });

  return formatComponentRegistry(registry, config.attrCase);
}
