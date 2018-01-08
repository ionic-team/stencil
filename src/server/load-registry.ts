import { BuildConfig, ComponentRegistry } from '../util/interfaces';
import { getAppRegistry } from '../compiler/app/app-registry';


export function loadComponentRegistry(config: BuildConfig) {
  const appRegistry = getAppRegistry(config);
  const cmpRegistry: ComponentRegistry = {};

  const tagNames = Object.keys(appRegistry.components);

  tagNames.forEach(tagName => {
    cmpRegistry[tagName] = {
      tagNameMeta: tagName,
      bundleIds: appRegistry.components[tagName]
    };
  });

  return cmpRegistry;
}
