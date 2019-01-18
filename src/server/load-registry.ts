import { CompilerCtx, ComponentRegistry, Config, OutputTargetWww } from '@declarations';
import { getAppRegistry } from '../compiler/app/app-registry';
import { ENCAPSULATION } from '@stencil/core/utils';


export function loadComponentRegistry(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTargetWww) {
  const appRegistry = getAppRegistry(config, compilerCtx, outputTarget);
  const cmpRegistry: ComponentRegistry = {};

  const tagNames = Object.keys(appRegistry.components);

  tagNames.forEach(tagName => {
    const reg = appRegistry.components[tagName];

    cmpRegistry[tagName] = {
      tagNameMeta: tagName,
      bundleIds: reg.bundleIds
    };

    if (reg.encapsulation === 'shadow') {
      cmpRegistry[tagName].encapsulationMeta = ENCAPSULATION.ShadowDom;
    } else if (reg.encapsulation === 'scoped') {
      cmpRegistry[tagName].encapsulationMeta = ENCAPSULATION.ScopedCss;
    }
  });

  return cmpRegistry;
}
