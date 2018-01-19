import { Config, ComponentRegistry, CompilerCtx } from '../util/interfaces';
import { getAppRegistry } from '../compiler/app/app-registry';


export function loadComponentRegistry(config: Config, ctx: CompilerCtx) {
  const appRegistry = getAppRegistry(config, ctx);
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
