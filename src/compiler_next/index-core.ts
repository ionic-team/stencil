import { initWebWorker } from './worker/worker-thread';
import { IS_WEB_WORKER_ENV } from './sys/environment';

export { compile } from './compile-module';
export { dependencies } from './sys/dependencies';
export { createCompiler } from './compiler';
export { getMinifyScriptOptions } from './config/compile-module-options';
export { loadConfig } from './config/load-config';
export { version } from '../version';

if (IS_WEB_WORKER_ENV) {
  initWebWorker(self as any);
}
