import { initWorkerThread } from './worker/worker-thread';
import path from './sys/modules/path';

export { compile, compileSync } from './compile-module';
export { createCompiler } from './compiler';
export { createSystem } from './sys/stencil-sys';
export { createWorkerContext } from './worker/worker-thread';
export { dependencies } from './sys/dependencies';
export { loadConfig } from './config/load-config';
export { optimizeCss } from './optimize/optimize-css';
export { optimizeJs } from './optimize/optimize-js';
export { path };
export { version } from '../version';

initWorkerThread(globalThis);
