import type { CompilerSystem } from '../declarations';
export declare const loadCoreCompiler: (sys: CompilerSystem) => Promise<CoreCompiler>;
export type CoreCompiler = typeof import('@stencil/core/compiler');
