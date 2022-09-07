import ts from 'typescript';

import { IS_WEB_WORKER_ENV } from './sys/environment';
import { createSystem } from './sys/stencil-sys';
import { initWebWorkerThread } from './sys/worker/web-worker-thread';
import { createWorkerMessageHandler } from './worker/worker-thread';
export { FsWriteResults } from './sys/in-memory-fs';

if (IS_WEB_WORKER_ENV) {
  initWebWorkerThread(createWorkerMessageHandler(createSystem()));
}

export { buildId, vermoji, version, versions } from '../version';
export { createCompiler } from './compiler';
export { loadConfig } from './config/load-config';
export { optimizeCss } from './optimize/optimize-css';
export { optimizeJs } from './optimize/optimize-js';
export { createPrerenderer } from './prerender/prerender-main';
export { dependencies } from './sys/dependencies.json';
export { path } from './sys/modules/path';
export { nodeRequire } from './sys/node-require';
export { createSystem } from './sys/stencil-sys';
export { transpile, transpileSync } from './transpile';
export { createWorkerContext } from './worker/worker-thread';
export { createWorkerMessageHandler } from './worker/worker-thread';
export { ts };
