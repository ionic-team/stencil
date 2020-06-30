import type { CompilerSystem } from '../declarations';

export async function loadCoreCompiler(sys: CompilerSystem): Promise<CoreCompiler> {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
}

export type CoreCompiler = typeof import('@stencil/core/compiler');
