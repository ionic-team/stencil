import * as d from '../../declarations';
import { catchError } from '@utils';


export function getPrerenderConfig(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  const prerenderConfig: d.PrerenderConfig = {};

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

  if (typeof prerenderConfig.trailingSlash !== 'boolean') {
    prerenderConfig.trailingSlash = false;
  }

  return prerenderConfig;
}



declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
