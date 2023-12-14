import type { CompilerCtx, ComponentCompilerMeta } from '../../declarations';
import { getModule } from '../transpile/transpiled-module';

// TODO: make recursive
export const combineInheritedCompilerMeta = (compilerCtx: CompilerCtx, compilerMeta: ComponentCompilerMeta) => {
  const clone = { ...compilerMeta };

  if (compilerMeta.parentClassPath) {
    const parentModule = getModule(compilerCtx, compilerMeta.parentClassPath);

    if (parentModule?.cmps.length) {
      const parentCmp = parentModule.cmps[0];
      clone.watchers = [...(clone.watchers ?? []), ...(parentCmp.watchers ?? [])];
      clone.listeners = [...(clone.listeners ?? []), ...(parentCmp.listeners ?? [])];
      clone.properties = [...(clone.properties ?? []), ...(parentCmp.properties ?? [])];
      clone.states = [...(clone.states ?? []), ...(parentCmp.states ?? [])];
      clone.methods = [...(clone.methods ?? []), ...(parentCmp.methods ?? [])];
    }
  }

  return clone;
};
