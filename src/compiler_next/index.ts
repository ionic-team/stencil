import { initWorkerThread } from './worker/worker-thread';

export { compile } from './compile-module';
export { createCompiler } from './compiler';
export { createSystem } from './sys/stencil-sys';
export { dependencies } from './sys/dependencies';
export { getMinifyScriptOptions } from './config/compile-module-options';
export { loadConfig } from './config/load-config';
export { version } from '../version';

initWorkerThread(globalThis);
