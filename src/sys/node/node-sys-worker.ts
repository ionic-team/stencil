import { attachMessageHandler } from './worker-farm/worker';
import { ShadowCss } from '../../compiler/style/shadow-css';

const autoprefixer = require('autoprefixer');
const gzipSize = require('gzip-size');
const postcss = require('postcss');


class NodeSystemWorker {

  async autoprefixCss(input: string, opts: any) {
    if (opts == null || typeof opts !== 'object') {
      opts = {
        browsers: [
          'last 2 versions',
          'iOS >= 9',
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
    return result.css as string;
  }

  gzipSize(text: string) {
    return gzipSize(text);
  }

  scopeCss(cssText: string, scopeAttribute: string, hostScopeAttr: string, slotScopeAttr: string) {
    const sc = new ShadowCss();
    return sc.shimCssText(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);
  }

}


export function init(process: NodeJS.Process) {
  const workerModule = new NodeSystemWorker();
  attachMessageHandler(process, workerModule);
}
