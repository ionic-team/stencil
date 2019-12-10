import * as d from '../../declarations';
import { compile } from '../compile-module';
import { initNodeWorkerThread } from '../../sys/node_next/worker/worker-child';
import { initWebWorkerThread } from '../sys/worker/web-worker-thread';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../sys/environment';
import { minifyJs } from '../optimize/optimize-module';
import { optimizeCssWorker } from '@optimize-css';
import { transformCssToEsm } from '../../compiler/style/css-to-esm';


export const createWorkerContext = (): d.CompilerWorkerContext => {
  return {
    compileModule: compile,
    minifyJs,
    optimizeCss: optimizeCssWorker,
    transformCssToEsm,
  };
};


export const createWorkerMsgHandler = (): d.WorkerMsgHandler => {
  const workerCtx = createWorkerContext();

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
    initWebWorkerThread(glbl, createWorkerMsgHandler());

  } else if (IS_NODE_ENV && glbl.process.argv.includes('stencil-worker')) {
    initNodeWorkerThread(glbl.process, createWorkerMsgHandler());
  }
};
