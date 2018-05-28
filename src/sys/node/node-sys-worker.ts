import { attachMessageHandler } from './worker-farm/worker';

const autoprefixer = require('autoprefixer');
const gzipSize = require('gzip-size');
const postcss = require('postcss');


class NodeSystemWorker {

  async autoprefixCss(input: string, opts: any) {
    if (opts == null || typeof opts !== 'object') {
      opts = {
        browsers: [
          'last 2 versions',
          'iOS >= 8',
          'Android >= 4.4',
          'Explorer >= 11',
          'ExplorerMobile >= 11'
        ],
        cascade: false,
        remove: false
      };
    }
    const prefixer = postcss([autoprefixer(opts)]);
    const result = await prefixer.process(input, {
      map: false,
      from: undefined
    });
    return result.css;
  }

  gzipSize(text: string) {
    return gzipSize(text);
  }

}


export function init(process: NodeJS.Process) {
  const workerModule = new NodeSystemWorker();
  attachMessageHandler(process, workerModule);
}
