import * as d from '../declarations';
import { catchError } from '@utils';
import { requireFunc } from '../compiler_next/sys/environment';


export function getPrerenderConfig(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  const prerenderConfig: d.PrerenderConfig = {};

  if (typeof prerenderConfigPath === 'string') {
    try {
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
