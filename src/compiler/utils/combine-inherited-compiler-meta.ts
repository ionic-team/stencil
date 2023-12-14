import type { CompilerCtx, ComponentCompilerMeta } from '../../declarations';
import { getModule } from '../transpile/transpiled-module';

export const combineInheritedCompilerMeta = (
  compilerCtx: CompilerCtx,
  compilerMeta: ComponentCompilerMeta,
): ComponentCompilerMeta => {
  const clonedMeta = { ...compilerMeta };

  if (clonedMeta.parentClassPath) {
    const parentModule = getModule(compilerCtx, clonedMeta.parentClassPath);

    if (parentModule?.cmps.length) {
      const parentCmp = parentModule.cmps[0];

      const parentMeta = combineInheritedCompilerMeta(compilerCtx, parentCmp);

      clonedMeta.watchers = [...(parentMeta.watchers ?? []), ...(clonedMeta.watchers ?? [])];
      clonedMeta.listeners = [...(parentMeta.listeners ?? []), ...(clonedMeta.listeners ?? [])];
      clonedMeta.properties = [...(parentMeta.properties ?? []), ...(clonedMeta.properties ?? [])];
      clonedMeta.states = [...(parentMeta.states ?? []), ...(clonedMeta.states ?? [])];
      clonedMeta.methods = [...(parentMeta.methods ?? []), ...(clonedMeta.methods ?? [])];
    }
  }

  return clonedMeta;
};
