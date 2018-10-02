import * as d from '../declarations';
import { getAppRegistry } from '../compiler/app/app-registry';
import { ENCAPSULATION } from '../util/constants';


export function loadComponentRegistry(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  const appRegistry = getAppRegistry(config, compilerCtx, outputTarget);
  const cmpRegistry: d.ComponentMap = new Map();

  const tagNames = Object.keys(appRegistry.components);

  tagNames.forEach(tagName => {
    const reg = appRegistry.components[tagName];

    const value: d.ComponentMeta = {
      tagNameMeta: tagName,
      bundleIds: reg.bundleIds
    };
    cmpRegistry.set(tagName, value);

    if (reg.encapsulation === 'shadow') {
      value.encapsulationMeta = ENCAPSULATION.ShadowDom;
    } else if (reg.encapsulation === 'scoped') {
      value.encapsulationMeta = ENCAPSULATION.ScopedCss;
    }
  });

  return cmpRegistry;
}
