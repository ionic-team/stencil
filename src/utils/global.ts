import { GlobalIonic, Patch } from '../utils/interfaces';
import { Config } from './config';
import { BrowserDomApi } from '../renderer/index';
declare const global: any;


export function Ionic(): GlobalIonic {
  const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
  const ionic: GlobalIonic  = (GLOBAL.ionic = GLOBAL.ionic || {});

  if (!ionic.dom) {
    ionic.dom = new BrowserDomApi(document);
  }

  if (!ionic.config) {
    ionic.config = new Config();
  }

  return ionic;
}
