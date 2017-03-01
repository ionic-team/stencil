import { Config } from './config';
import { GlobalIonic } from '../utils/interfaces';
import { BrowserDomApi } from '../renderer/api/browser-api';

declare const global: any;


export function Ionic(opts?: GlobalIonic): GlobalIonic {
  const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
  const ionic: GlobalIonic  = (GLOBAL.ionic = GLOBAL.ionic || {});

  if (opts) {
    if (opts.dom) {
      ionic.dom = new BrowserDomApi(document);
    }
    if (opts.config) {
      ionic.config = opts.config;
    }
  }

  if (!ionic.dom) {
    ionic.dom = new BrowserDomApi(document);
  }

  if (!ionic.config) {
    ionic.config = new Config();
  }

  return ionic;
}
