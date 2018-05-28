import { attachMessageHandler } from './worker-farm/worker';
const gzipSize = require('gzip-size');


class NodeSystemWorker {

  gzipSize(text: string) {
    return gzipSize(text);
  }

}


export function init(process: NodeJS.Process) {
  const workerModule = new NodeSystemWorker();
  attachMessageHandler(process, workerModule);
}
