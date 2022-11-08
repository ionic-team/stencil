import type { CompilerSystem } from '../declarations';

export const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  console.log('loadCoreCompiler::1');
  await sys.dynamicImport(sys.getCompilerExecutingPath());
  console.log('loadCoreCompiler::2');
  return (globalThis as any).stencil;
};

export type CoreCompiler = typeof import('@stencil/core/compiler');
