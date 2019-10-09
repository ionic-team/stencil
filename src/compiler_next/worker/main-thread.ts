import { CompileOptions, CompileResults, CompileScriptMinifyOptions, CompilerBuildResults, CompilerSystemAsync, CompilerWatcher, Config, Diagnostic } from '../../declarations';
import { buildEvents } from '../../compiler/events';
import { CompilerWorkerMsg, CompilerWorkerMsgType } from './worker-interfaces';
import { version } from '../../version';


export const createWorkerCompiler = async () => {
  let msgIds = 0;
  let isQueued = false;
  const tick = Promise.resolve();
  const resolves = new Map<number, Function>();
  const queuedMsgs: CompilerWorkerMsg[] = [];
  const events = buildEvents();
  const executingPath = import.meta.url;
  const workerUrl = new URL(`./stencil.js?v=${version}`, executingPath);
  const worker = new Worker(workerUrl, { name: `@stencil/core/compiler@${version}` });

  const build = () => post({ type: CompilerWorkerMsgType.Build });

  const createWatcher = () => post({ type: CompilerWorkerMsgType.CreateWatcher }).then(() => {
    const start = () => post({ type: CompilerWorkerMsgType.WatchStart });

    const close = () => post({ type: CompilerWorkerMsgType.WatchClose });

    const watcher = {
      start,
      close,
      on: events.on
    };
    return watcher;
  });

  const destroy = () => post({ type: CompilerWorkerMsgType.DestroyCompiler }).then(() => {
    worker.terminate();
  });

  const sys: CompilerSystemAsync = {
    access: path => post({ type: CompilerWorkerMsgType.SysAccess, path }),
    mkdir: path => post({ type: CompilerWorkerMsgType.SysMkDir, path }),
    readdir: path => post({ type: CompilerWorkerMsgType.SysReadDir, path }),
    readFile: path => post({ type: CompilerWorkerMsgType.SysReadFile, path }),
    rmdir: path => post({ type: CompilerWorkerMsgType.SysRmDir, path }),
    stat: path => post({ type: CompilerWorkerMsgType.SysStat, path }),
    unlink: path => post({ type: CompilerWorkerMsgType.SysUnlink, path }),
    writeFile: (path, content) => post({ type: CompilerWorkerMsgType.SysWriteFile, path, content }),
  };

  const loadConfig = (config: Config) => post({
    type: CompilerWorkerMsgType.LoadConfig,
    config
  });

  const compileModule = (code: string, opts: CompileOptions = {}) => post({
    type: CompilerWorkerMsgType.CompileModule,
    code,
    opts
  });

  const getMinifyScriptOptions = (opts: CompileScriptMinifyOptions = {}) => post({
    type: CompilerWorkerMsgType.MinifyScriptOptions,
    opts
  });

  const post = (msg: CompilerWorkerMsg) => new Promise<any>(resolve => {
    msg.stencilMsgId = msgIds++;
    resolves.set(msg.stencilMsgId, resolve);

    queuedMsgs.push(msg);
    if (!isQueued) {
      isQueued = true;
      tick.then(() => {
        isQueued = false;
        worker.postMessage(JSON.stringify(queuedMsgs));
        queuedMsgs.length = 0;
      });
    }
  });

  worker.onmessage = (ev) => {
    let msgs: CompilerWorkerMsg[];
    if (typeof ev.data === 'string') {
      try {
        msgs = JSON.parse(ev.data);
      } catch (e) {}
    }
    if (Array.isArray(msgs)) {
      msgs.forEach(msg => {
        if (typeof msg.onEventName === 'string') {
          events.emit(msg.onEventName as any, msg.data);
        } else {
          const resolveFn = resolves.get(msg.stencilMsgId);
          if (resolveFn) {
            resolves.delete(msg.stencilMsgId);
            resolveFn(msg.data);
          }
        }
      });
    }
  };

  return post({ type: CompilerWorkerMsgType.InitCompiler }).then(() => {
    const compiler: WorkerCompiler = {
      build,
      compileModule,
      createWatcher,
      destroy,
      getMinifyScriptOptions,
      loadConfig,
      sys
    };
    return compiler;
  });
};


export interface WorkerCompiler {
  build(): Promise<CompilerBuildResults>;
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  createWatcher(): Promise<CompilerWatcher>;
  destroy(): Promise<void>;
  getMinifyScriptOptions(): Promise<CompileScriptMinifyOptions>;
  loadConfig(config?: Config): Promise<Diagnostic[]>;
  sys: CompilerSystemAsync;
}
