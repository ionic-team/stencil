import type * as d from '../../declarations';
import { optimizeCss } from '../optimize/optimize-css';
import { prepareModule } from '../optimize/optimize-module';
import { prerenderWorker } from '../prerender/prerender-worker';
import { transformCssToEsm } from '../style/css-to-esm';

export const createWorkerContext = (sys: d.CompilerSystem): d.CompilerWorkerContext => ({
  transformCssToEsm,
  prepareModule,
  optimizeCss,
  prerenderWorker: (prerenderRequest) => prerenderWorker(sys, prerenderRequest),
});

export const createWorkerMessageHandler = (sys: d.CompilerSystem): d.WorkerMsgHandler => {
  const workerCtx = createWorkerContext(sys);

  return (msgToWorker: d.MsgToWorker) => {
    const fnName: string = msgToWorker.args[0];
    const fnArgs = msgToWorker.args.slice(1);
    const fn = (workerCtx as any)[fnName] as Function;
    if (typeof fn === 'function') {
      return fn(...fnArgs);
    }
  };
};
