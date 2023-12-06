import type { CompilerSystem } from '../declarations';

export const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  const compilerMod = await sys.dynamicImport!(sys.getCompilerExecutingPath());

  // TODO(STENCIL-1018): Remove Rollup Infrastructure
  if ((globalThis as any).stencil) {
    return (globalThis as any).stencil;
  } else {
    (globalThis as any).stencil = compilerMod;
    return compilerMod;
  }
};

export type CoreCompiler = typeof import('@stencil/core/compiler');
