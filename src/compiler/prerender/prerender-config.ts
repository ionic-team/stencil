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
    prerenderConfig.filterAnchor = defaultFilterAnchor;
  }

  if (typeof prerenderConfig.normalizeUrl !== 'function') {
    prerenderConfig.normalizeUrl = defaultNormalizeUrl;
  }

  if (typeof prerenderConfig.filterUrl !== 'function') {
    prerenderConfig.filterUrl = defaultFilterUrl;
  }

  if (typeof prerenderConfig.trailingSlash !== 'boolean') {
    prerenderConfig.trailingSlash = false;
  }

  return prerenderConfig;
}


function defaultFilterAnchor(attrs: {[attrName: string]: string}, _base: URL) {
  let href = attrs.href;
  if (typeof href !== 'string') {
    return false;
  }

  href = href.trim();
  if (href === '' || href === '#') {
    return false;
  }

  if (typeof attrs.target === 'string' && attrs.target.trim().toLowerCase() !== '_self') {
    return false;
  }

  return true;
}


function defaultNormalizeUrl(href: string, base: URL) {
  const outputUrl = new URL(href, base.href);
  outputUrl.hash = '';
  outputUrl.search = '';
  return outputUrl;
}


export function normalizeHref(prerenderConfig: d.HydrateConfig, url: URL) {
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


function defaultFilterUrl(url: URL, base: URL) {
  if (url == null || base == null) {
    return false;
  }
  if (url.hostname != null && base.hostname != null && url.hostname !== base.hostname) {
    return false;
  }
  return true;
}


declare const __webpack_require__: any;
declare const __non_webpack_require__: any;
