import { createSystem } from './sys/stencil-sys';
import { createWorkerMessageHandler } from './worker/worker-thread';
import { initWebWorkerThread } from './sys/worker/web-worker-thread';
import { IS_WEB_WORKER_ENV } from './sys/environment';
import ts from 'typescript';
export { FsWriteResults } from './sys/in-memory-fs';

if (IS_WEB_WORKER_ENV) {
  initWebWorkerThread(createWorkerMessageHandler(createSystem()));
}

export { createCompiler } from './compiler';
export { createPrerenderer } from './prerender/prerender-main';
export { createSystem } from './sys/stencil-sys';
export { createWorkerContext } from './worker/worker-thread';
export { createWorkerMessageHandler } from './worker/worker-thread';
export { dependencies } from './sys/dependencies.json';
export { loadConfig } from './config/load-config';
export { nodeRequire } from './sys/node-require';
export { optimizeCss } from './optimize/optimize-css';
export { optimizeJs } from './optimize/optimize-js';
export { path } from './sys/modules/path';
export { transpile, transpileSync } from './transpile';
export { version, versions, vermoji, buildId } from '../version';
export { ts };
