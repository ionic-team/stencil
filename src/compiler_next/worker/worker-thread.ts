import * as d from '../../declarations';
import { buildEvents } from '../../compiler/events';
import { compile } from '../compile-module';
import { createCompiler } from '../compiler';
import { createStencilSys } from '../sys/stencil-sys';
import { initNodeWorkerThread } from '../../sys/node_next/worker/worker-child';
import { initWebWorkerThread } from '../sys/worker/web-worker-thread';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../sys/environment';
import { loadConfig } from '../config/load-config';
import { minifyJs } from '../optimize/optimize-module';


export const createWorkerContext = (events: d.BuildEvents): d.CompilerWorkerContext => {
  let config: d.Config;
  let compiler: d.CompilerNext;
  let sys: d.CompilerSystemAsync;
  let watcher: d.CompilerWatcher;

  const getCompiler = async () => {
    if (config) {
      if (!compiler) {
        compiler = await createCompiler(config);
      }
      return compiler;
    }
    return null;
  };

  const autoPrefixCss = (css: string) => {
    return Promise.resolve({
      output: css + '/* todo autoprefixer */',
      diagnostics: []
    });
  };

  const build = async () => {
    const cmplr = await getCompiler();
    return cmplr.build();
  };

  const createWatcher = async (): Promise<d.CompilerWatcher> => {
    const cmplr = await getCompiler();
    watcher = await cmplr.createWatcher();
    watcher.on(events.emit);
    return null;
  };

  const destroy = async () => {
    if (compiler) {
      await compiler.destroy();
      compiler = config = watcher = null;
    }
  };

  const initCompiler = async () => {
    sys = createStencilSys();
  };

  const loadCompilerConfig = async (inputConfig: d.Config) => {
    const validated = await loadConfig({
      sys_next: sys as any,
      ...inputConfig
    });
    config = validated.config;
    return validated.diagnostics;
  };

  const watcherClose = async () => {
    const rtnValue = await watcher.close();
    watcher = null;
    return rtnValue;
  };

  const watcherStart = async () => watcher.start();

  return {
    autoPrefixCss,
    build,
    compileModule: compile,
    createWatcher,
    destroy,
    initCompiler,
    loadConfig: loadCompilerConfig,
    minifyJs,
    sysAccess: (p) => sys.access(p),
    sysMkdir: (p) => sys.mkdir(p),
    sysReadFile: (p) => sys.readFile(p),
    sysReaddir: (p) => sys.readdir(p),
    sysRmdir: (p) => sys.rmdir(p),
    sysStat: (p) => sys.stat(p),
    sysUnlink: (p) => sys.unlink(p),
    sysWriteFile: (p, content) => sys.writeFile(p, content),
    watcherClose,
    watcherStart,
  };
};


export const createWorkerMsgHandler = (): d.WorkerMsgHandler => {
  const events = buildEvents();
  const workerCtx = createWorkerContext(events);

  const handleMsg = async (msgToWorker: d.MsgToWorker) => {
    const fnName: string = msgToWorker.args[0];
    const fnArgs = msgToWorker.args.slice(1);
    const fn = (workerCtx as any)[fnName] as Function;
    return fn.apply(null, fnArgs);
  };

  return handleMsg;
};


export const initWorkerThread = (glbl: any) => {
  if (IS_WEB_WORKER_ENV) {
    if (location.search.includes('stencil-worker')) {
      initWebWorkerThread(glbl, createWorkerMsgHandler());
    }
  } else if (IS_NODE_ENV) {
    if (glbl.process.argv.includes('stencil-worker')) {
      initNodeWorkerThread(glbl.process, createWorkerMsgHandler());
    }
  }
};
