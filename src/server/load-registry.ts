import { CompilerCtx, ComponentRegistry, Config, OutputTarget } from '../declarations';
import { getAppRegistry } from '../compiler/app/app-registry';


export function loadComponentRegistry(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget) {
  const appRegistry = getAppRegistry(config, compilerCtx, outputTarget);
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
