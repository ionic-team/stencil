import { BuildEvents, CompilerWorkerContext, WorkerMainController } from '../../declarations';


export const createWorkerMainContext = (workerCtrl: WorkerMainController, events: BuildEvents): CompilerWorkerContext => {
  const send = workerCtrl.sendMessage;

  return {
    autoPrefixCss: (css) => send('autoPrefixCss', css),
    build: () => send('build'),
    compileModule: (code, opts) => send('compileModule', code, opts),
    createWatcher: () => send('createWatcher').then(() => (
      {
        start: () => send('watcherStart'),
        close: () => send('watcherClose'),
        on: events.on,
      }
    )),
    destroy: () => send('destroy').then(() => {
      workerCtrl.destroy();
    }),
    initCompiler: () => send('initCompiler'),
    loadConfig: (config) => send('loadConfig', config),
    sysAccess: (p) => send('sysAccess', p),
    sysMkdir: (p) => send('sysMkdir', p),
    sysReadFile: (p) => send('sysReadFile', p),
    sysReaddir: (p) => send('sysReaddir', p),
    sysRmdir: (p) => send('sysRmdir', p),
    sysStat: (p) => send('sysStat', p),
    sysUnlink: (p) => send('sysUnlink', p),
    sysWriteFile: (p, content) => send('sysWriteFile', p, content),
    watcherClose: () => send('watcherClose'),
    watcherStart: () => send('watcherStart'),
  };
};
