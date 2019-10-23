import * as d from '../../declarations';
import { buildEvents } from '../../compiler/events';
import { compile } from '../compile-module';
import { createCompiler } from '../compiler';
import { createStencilSys } from '../sys/stencil-sys';
import { createWebWorkerThread } from '../sys/worker/web-worker-thread';
import { isNumber, isString } from '@utils';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '../sys/environment';
import { loadConfig } from '../config/load-config';


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
    return Promise.resolve(css + '/* todo autoprefixer */');
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

  const handleMsg = async (fromMainMsg: d.WorkerMsg) => {
    if (!fromMainMsg || !isNumber(fromMainMsg.stencilId)) return null;

    const responseToMainMsg: d.WorkerMsg = {
      stencilId: fromMainMsg.stencilId,
      rtnValue: null,
      rtnError: null,
    };

    try {
      const fnName: string = fromMainMsg.inputArgs[0];
      const fnArgs = fromMainMsg.inputArgs.slice(1);
      const fn = (workerCtx as any)[fnName] as Function;

      responseToMainMsg.rtnValue = await fn.apply(null, fnArgs);

    } catch (e) {
      responseToMainMsg.rtnError = 'Error';
      if (isString(e)) {
        responseToMainMsg.rtnError += ': ' + e;
      } else if (e) {
        if (e.stack) {
          responseToMainMsg.rtnError += ': ' + e.stack;
        } else if (e.message) {
          responseToMainMsg.rtnError += ': ' + e.message;
        }
      }
    }

    return responseToMainMsg;
  };

  return handleMsg;
};


const initWebWorkerThread = (workerSelf: Worker) => {
  if (location.search.includes('stencil-worker')) {
    const msgHandler = createWorkerMsgHandler();
    createWebWorkerThread(workerSelf, msgHandler);
  }
};

const initNodeWorkerThread = (prcs: NodeJS.Process) => {
  const forkModuleArg = prcs.argv.find((a: string) => a.startsWith('--stencil-worker="') && a.endsWith('"'));
  if (forkModuleArg) {
    const msgHandler = createWorkerMsgHandler();
    let forkModulePath = forkModuleArg.split('="')[1];
    forkModulePath = forkModulePath.substr(0, forkModulePath.length - 1);
    console.log(forkModuleArg, forkModulePath)
    const forkModule = requireFunc(forkModulePath);
    forkModule.createNodeWorkerThread(prcs, msgHandler);
  }
};

export const initWorkerThread = (glbl: any) => {
  if (IS_WEB_WORKER_ENV) {
    initWebWorkerThread(glbl);
  } else if (IS_NODE_ENV) {
    initNodeWorkerThread(glbl.process);
  }
};
