import * as d from '../../declarations';
import { compile } from '../compile-module';
import { CompilerWorkerMsg, CompilerWorkerMsgType } from './worker-interfaces';
import { createCompiler } from '../compiler';
import { createStencilSys } from '../sys/stencil-sys';
import { getMinifyScriptOptions } from '../config/compile-module-options';
import { loadConfig } from '../config/load-config';


export const initWebWorker = (self: Worker) => {
  let config: d.Config;
  let compiler: d.CompilerNext;
  let watcher: d.CompilerWatcher;
  let watcherCloseMsgId: number;
  let isQueued: boolean;
  let sys: d.CompilerSystem;
  let queuedMsgs: CompilerWorkerMsg[];
  let tick: Promise<void>;

  const initCompiler = async (msg: CompilerWorkerMsg) => {
    queuedMsgs = [];
    sys = createStencilSys();
    tick = Promise.resolve();
    post({ stencilMsgId: msg.stencilMsgId });
  };

  const getCompiler = async () => {
    if (config) {
      if (!compiler) {
        compiler = await createCompiler(config);
      }
      return compiler;
    }
    return null;
  };

  const loadCompilerConfig = async (msg: CompilerWorkerMsg) => {
    const validated = await loadConfig({
      sys_next: sys,
      ...msg.config
    });
    config = validated.config;
    return post({ stencilMsgId: msg.stencilMsgId, data: validated.diagnostics });
  };

  const destroy = async (msg: CompilerWorkerMsg) => {
    if (compiler) {
      await compiler.destroy();
      compiler = config = watcher = watcherCloseMsgId = null;
    }
    post({ stencilMsgId: msg.stencilMsgId });
  };

  const build = async (msg: CompilerWorkerMsg) => {
    const cmplr = await getCompiler();
    if (cmplr) {
      post({
        stencilMsgId: msg.stencilMsgId,
        data: await cmplr.build()
      });

    } else {
      post({
        stencilMsgId: msg.stencilMsgId,
        data: [{ type: 'err', messageText: 'Compiler not loaded' } as d.Diagnostic]
      });
    }
  };

  const createWatcher = async (msg: CompilerWorkerMsg) => {
    const cmplr = await getCompiler();
    if (cmplr) {
      watcher = await cmplr.createWatcher();
      watcher.on((eventName, data) => {
        post({ onEventName: eventName, data });
      });
      post({ stencilMsgId: msg.stencilMsgId });
    } else {
      post({
        stencilMsgId: msg.stencilMsgId,
        data: [{ type: 'err', messageText: 'Compiler not loaded' } as d.Diagnostic]
      });
    }
  };

  const watcherStart = (msg: CompilerWorkerMsg) => {
    if (watcher) {
      watcherCloseMsgId = msg.stencilMsgId;
      watcher.start();

    } else {
      post({ stencilMsgId: msg.stencilMsgId });
    }
  };

  const watcherClose = async (msg: CompilerWorkerMsg) => {
    if (watcher) {
      post({
        stencilMsgId: watcherCloseMsgId,
        data: await watcher.close()
      });
      watcher = watcherCloseMsgId = null;
    }

    post({ stencilMsgId: msg.stencilMsgId });
  };

  const onMessage = async (msg: CompilerWorkerMsg) => {
    if (msg && typeof msg.stencilMsgId === 'number' && typeof msg.type === 'number') {
      switch (msg.type) {

        case CompilerWorkerMsgType.InitCompiler:
          initCompiler(msg);
          break;

        case CompilerWorkerMsgType.LoadConfig:
          loadCompilerConfig(msg);
          break;

        case CompilerWorkerMsgType.DestroyCompiler:
          destroy(msg);
          break;

        case CompilerWorkerMsgType.Build:
          build(msg);
          break;

        case CompilerWorkerMsgType.CreateWatcher:
          createWatcher(msg);
          break;

        case CompilerWorkerMsgType.WatchStart:
          watcherStart(msg);
          break;

        case CompilerWorkerMsgType.WatchClose:
          watcherClose(msg);
          break;

        case CompilerWorkerMsgType.CompileModule:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await compile(msg.code, msg.opts)
          });
          break;

        case CompilerWorkerMsgType.MinifyScriptOptions:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: getMinifyScriptOptions(msg.opts)
          });
          break;

        case CompilerWorkerMsgType.SysAccess:
          post({
            data: await sys.access(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysMkDir:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.mkdir(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysReadDir:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.readdir(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysReadFile:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.readFile(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysRmDir:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.rmdir(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysStat:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.stat(msg.path)
          });
          break;

        case CompilerWorkerMsgType.SysWriteFile:
          post({
            stencilMsgId: msg.stencilMsgId,
            data: await sys.writeFile(msg.path, msg.content)
          });
          break;

        default:
          throw new Error(`invalid worker message: ${msg}`);
      }
    }
  };

  const post = (msg: CompilerWorkerMsg) => {
    queuedMsgs.push(msg);
    if (!isQueued) {
      isQueued = true;
      tick.then(() => {
        isQueued = false;
        self.postMessage(JSON.stringify(queuedMsgs));
        queuedMsgs.length = 0;
      });
    }
  };

  self.onmessage = (ev) => {
    let msgs: CompilerWorkerMsg[];
    if (typeof ev.data === 'string') {
      try {
        msgs = JSON.parse(ev.data);
      } catch (e) {}
    }
    if (Array.isArray(msgs)) {
      msgs.forEach(onMessage);
    }
  };
};
