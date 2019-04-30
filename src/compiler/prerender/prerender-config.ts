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

  if (typeof prerenderConfig.filterAnchor !== 'function') {
    prerenderConfig.filterAnchor = function defaultFilterAnchor(attrs: {[attrName: string]: string}, _base: URL) {
      let isValidAnchor = false;

      try {
        let href = attrs.href;
        if (typeof href === 'string') {
          href = href.trim();

          if (href !== '' && href !== '#') {
            const target = attrs.target;
            if (typeof target === 'string' && attrs.target.trim().toLowerCase() !== '_self') {
              isValidAnchor = false;
            } else {
              isValidAnchor = true;
            }
          }
        }

      } catch (e) {
        catchError(diagnostics, e);
      }

      return isValidAnchor;
    };
  }

  if (typeof prerenderConfig.normalizeUrl !== 'function') {
    prerenderConfig.normalizeUrl = function defaultNormalizeUrl(href: string, base: URL) {
      if (typeof href === 'string') {
        try {
          const outputUrl = new URL(href, base.href);
          outputUrl.hash = '';
          outputUrl.search = '';
          return outputUrl;

        } catch (e) {
          catchError(diagnostics, e);
        }
      }
      return null;
    };
  }

  if (typeof prerenderConfig.filterUrl !== 'function') {
    prerenderConfig.filterUrl = function defaultFilterUrl(url: URL, base: URL) {
      let isValidUrl = false;

      try {
        if (url != null && base != null) {
          isValidUrl = !(url.hostname != null && base.hostname != null && url.hostname !== base.hostname);
        }

      } catch (e) {
        catchError(diagnostics, e);
      }
      return isValidUrl;
    };
  }

  if (typeof prerenderConfig.trailingSlash !== 'boolean') {
    prerenderConfig.trailingSlash = false;
  }

  return prerenderConfig;
}


export function normalizeHref(prerenderConfig: d.HydrateConfig, diagnostics: d.Diagnostic[], url: URL) {
  try {
    if (url != null && typeof url.href === 'string') {
      let href = url.href.trim();

      if (prerenderConfig.trailingSlash) {
        // url should have a trailing slash
        if (!href.endsWith('/')) {
          const parts = url.pathname.split('/');
          const lastPart = parts[parts.length - 1];
          if (!lastPart.includes('.')) {
            // does not end with a slash and last part does not have a dot
            href += '/';
          }
        }

      } else {
        // url should NOT have a trailing slash
        if (href.endsWith('/') && url.pathname !== '/') {
          // this has a trailing slash and it's not the root path
          href = href.substr(0, href.length - 1);
        }
      }

      return href;
    }

  } catch (e) {
    catchError(diagnostics, e);
  }
  return null;
}


declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
