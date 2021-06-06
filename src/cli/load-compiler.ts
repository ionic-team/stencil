import type { CompilerSystem } from '../declarations';

export const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export type CoreCompiler = typeof import('@stencil/core/compiler');
