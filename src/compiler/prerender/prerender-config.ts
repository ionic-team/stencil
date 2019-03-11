import * as d from '../../declarations';
import { catchError } from '@utils';


export function getPrerenderConfig(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  const prerenderConfig: d.HydrateConfig = {};

  if (typeof prerenderConfigPath === 'string') {
    try {
      // webpack work-around/hack
      const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
      const userConfig = requireFunc(prerenderConfigPath);
      if (userConfig != null) {
        Object.assign(prerenderConfig, userConfig);
      }

    } catch (e) {
      catchError(diagnostics, e);
    }
  }

  if (typeof prerenderConfig.filterUrl !== 'function') {
    prerenderConfig.filterUrl = filterUrl;
  }

  if (typeof prerenderConfig.normalizeUrl !== 'function') {
    prerenderConfig.normalizeUrl = normalizeUrl;
  }

  if (typeof prerenderConfig.hydrateOptions !== 'function') {
    prerenderConfig.hydrateOptions = hydrateOptions;
  }

  return prerenderConfig;
}


function filterUrl(_url: URL, _base: URL) {
  return true;
}


function normalizeUrl(url: URL, base: URL) {
  const outputUrl = new URL(url.href, base.href);
  outputUrl.hash = '';
  outputUrl.search = '';
  return outputUrl.href;
}


function hydrateOptions(_url: URL) {
  const opts: d.HydrateOptions = {

  };
  return opts;
}


declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
