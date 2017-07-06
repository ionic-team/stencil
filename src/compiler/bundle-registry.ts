import { BuildConfig, BuildContext, BundlerConfig, ComponentRegistry, ModuleResults,
  LoadComponentRegistry, StyleMeta, StylesResults } from './interfaces';
import { formatComponentRegistry } from '../util/data-serialize';


export function generateComponentRegistry(buildConfig: BuildConfig, ctx: BuildContext, bundlerConfig: BundlerConfig, styleResults: StylesResults, moduleResults: ModuleResults): LoadComponentRegistry[] {
  const registry: ComponentRegistry = {};

  // create the minimal registry component data for each bundle
  Object.keys(styleResults.bundles).forEach(bundleId => {
    // a bundle id is made of of each component tag name
    // separated by a period
    const components = bundleId.split('.');
    const styleResult = styleResults.bundles[bundleId];
    let styleMeta: StyleMeta = null;

    if (styleResult) {
      Object.keys(styleResult).forEach(modeName => {
        styleMeta = styleMeta || {};
        styleMeta[modeName] = styleMeta[modeName] || {};
        styleMeta[modeName].styleId = styleResult[modeName];
      });
    }

    components.forEach(tag => {
      registry[tag] = registry[tag] || bundlerConfig.manifest.components.find(c => c.tagNameMeta === tag);
      if (registry[tag]) {
        registry[tag].styleMeta = styleMeta;
      }
    });
  });


  Object.keys(moduleResults.bundles).forEach(bundleId => {
    const components = bundleId.split('.');
    const moduleId = moduleResults.bundles[bundleId];

    components.forEach(tag => {
      registry[tag] = registry[tag] || bundlerConfig.manifest.components.find(c => c.tagNameMeta === tag);
      if (registry[tag]) {
        registry[tag].moduleId = moduleId;
      }
    });
  });

  const componentRegistry = formatComponentRegistry(registry, bundlerConfig.attrCase);
  const projectRegistry = {
    namespace: buildConfig.namespace,
    components: componentRegistry
  };

  const registryFileName = `${buildConfig.namespace.toLowerCase()}.registry.json`;
  const registryFilePath = buildConfig.sys.path.join(buildConfig.buildDest, registryFileName);

  ctx.filesToWrite[registryFilePath] = JSON.stringify(projectRegistry, null, 2);

  return componentRegistry;
}
