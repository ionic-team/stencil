import * as d from '../declarations';
import { buildError, catchError, requireFunc } from '@utils';
import fs from 'fs';


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

export function validatePrerenderConfigPath(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  if (typeof prerenderConfigPath === 'string') {
    const hasAccess = fs.existsSync(prerenderConfigPath);
    if (!hasAccess) {
      const err = buildError(diagnostics);
      err.header = `Prerender Config Not Found`;
      err.messageText = `Unable to access: ${prerenderConfigPath}`;

    } else {
      try {
        const userConfig = requireFunc(prerenderConfigPath);
        if (!userConfig) {
          const err = buildError(diagnostics);
          err.header = `Invalid Prerender Config`;
          err.messageText = `Invalid prerender config: ${prerenderConfigPath}`;
        }

      } catch (e) {
        catchError(diagnostics, e);
      }
    }
  }
}
