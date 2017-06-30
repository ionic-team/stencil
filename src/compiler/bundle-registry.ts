import { BundlerConfig, BuildContext, ComponentRegistry, ModuleResults, StyleMeta, StylesResults } from './interfaces';
import { formatComponentRegistry } from '../util/data-serialize';
import { writeFile } from './util';


export function generateComponentRegistry(config: BundlerConfig, ctx: BuildContext, styleResults: StylesResults, moduleResults: ModuleResults) {
  const registry: ComponentRegistry = {};

  // create the minimal registry component data for each bundle
  Object.keys(styleResults).forEach(bundleId => {
    // a bundle id is made of of each component tag name
    // separated by a period
    const components = bundleId.split('.');
    const styleResult = styleResults[bundleId];
    let styleMeta: StyleMeta = null;

    if (styleResult) {
      Object.keys(styleResult).forEach(modeName => {
        styleMeta = styleMeta || {};
        styleMeta[modeName] = styleMeta[modeName] || {};
        styleMeta[modeName].styleId = styleResult[modeName];
      });
    }

    components.forEach(tag => {
      registry[tag] = registry[tag] || config.manifest.components.find(c => c.tagNameMeta === tag);
      registry[tag].styleMeta = styleMeta;
    });
  });


  Object.keys(moduleResults).forEach(bundleId => {
    const components = bundleId.split('.');
    const moduleId = moduleResults[bundleId];

    components.forEach(tag => {
      registry[tag] = registry[tag] || config.manifest.components.find(c => c.tagNameMeta === tag);
      registry[tag].moduleId = moduleId;
    });
  });

  let registryData = formatComponentRegistry(registry, config.attrCase);
  let registryContent = JSON.stringify(registryData);

  const registryFileName = `ionic.registry.json`;
  const registryFilePath = config.sys.path.join(config.destDir, registryFileName);

  ctx.results.componentRegistry = registryContent;

  return writeFile(config.sys, registryFilePath, registryContent);
}
