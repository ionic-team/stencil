import { buildEvents } from '../../compiler/events';
import { CompileOptions, CompileResults, CompilerBuildResults, CompilerSystemAsync, CompilerWatcher, Config, Diagnostic } from '../../declarations';
import { createWebWorkerMainController } from '../sys/worker/web-worker-main';
import { createWorkerMainContext } from './main-thread';


export const createWorkerCompiler = async (): Promise<WorkerCompiler> => {
  // main thread that creates an interface to the worker thread
  // the worker thread is running the one compiler
  const events = buildEvents();
  const workerCtrl = createWebWorkerMainController(1, events);
  const worker = createWorkerMainContext(workerCtrl, events);

  await worker.initCompiler();

  return {
    build: worker.build,
    compileModule: worker.compileModule,
    createWatcher: worker.createWatcher,
    destroy: worker.destroy,
    loadConfig: worker.loadConfig,
    sys: {
      access: (p) => worker.sysAccess(p),
      mkdir: (p) => worker.sysMkdir(p),
      readFile: (p) => worker.sysReadFile(p),
      readdir: (p) => worker.sysReaddir(p),
      rmdir: (p) => worker.sysRmdir(p),
      stat: (p) => worker.sysStat(p),
      unlink: (p) => worker.sysUnlink(p),
      writeFile: (p, content) => worker.sysWriteFile(p, content),
    }
  };
};


export interface WorkerCompiler {
  build(): Promise<CompilerBuildResults>;
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  createWatcher(): Promise<CompilerWatcher>;
  destroy(): Promise<void>;
  loadConfig(config?: Config): Promise<Diagnostic[]>;
  sys: CompilerSystemAsync;
}
