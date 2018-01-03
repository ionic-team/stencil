import { BuildConfig, Diagnostic, HydrateOptions, HydrateResults } from '../util/interfaces';


export function generateHydrateResults(config: BuildConfig, opts: HydrateOptions) {
  // https://nodejs.org/api/url.html
  const url = opts.url || '';
  const urlParse =  config.sys.url.parse(url);

  const hydrateResults: HydrateResults = {
    diagnostics: [],
    url: url,
    host: urlParse.host,
    hostname: urlParse.hostname,
    port: urlParse.port,
    path: urlParse.path,
    pathname: urlParse.pathname,
    search: urlParse.search,
    query: urlParse.query,
    hash: urlParse.hash,
    html: opts.html,
    styles: null,
    anchors: [],
    components: [],
    styleUrls: [],
    scriptUrls: [],
    imgUrls: [],
    opts: opts
  };

  createConsole(config, opts, hydrateResults);

  return hydrateResults;
}


function createConsole(config: BuildConfig, opts: HydrateOptions, results: HydrateResults) {
  const pathname = results.pathname;
  opts.console = opts.console || {};

  if (typeof opts.console.error !== 'function') {
    opts.console.error = function(...args: string[]) {
      results.diagnostics.push({
        level: `error`,
        type: `hydrate`,
        header: `runtime console.error: ${pathname}`,
        messageText: args.join(', ')
      });
    };
  }

  if (config.logger.level === 'debug') {
    ['debug', 'info', 'log', 'warn'].forEach(level => {
      if (typeof (opts.console as any)[level] !== 'function') {
        opts.console[level] = function(...args: string[]) {
          results.diagnostics.push({
            level: level as any,
            type: 'hydrate',
            header: `runtime console.${level}: ${pathname}`,
            messageText: args.join(', ')
          });
        };
      }
    });
  }
}


export function normalizeDirection(doc: Document, opts: HydrateOptions) {
  let dir = doc.body.getAttribute('dir');
  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir.trim().length > 0) {
      console.warn(`dir="${dir}" should be placed on the <html> instead of <body>`);
    }
  }

  if (opts.dir) {
    dir = opts.dir;
  } else {
    dir = doc.documentElement.getAttribute('dir');
  }

  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir !== 'ltr' && dir !== 'rtl') {
      console.warn(`only "ltr" and "rtl" are valid "dir" values on the <html> element`);
    }
  }

  if (dir !== 'ltr' && dir !== 'rtl') {
    dir = 'ltr';
  }

  doc.documentElement.dir = dir;
}


export function normalizeLanguage(doc: Document, opts: HydrateOptions) {
  let lang = doc.body.getAttribute('lang');
  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.trim().length > 0) {
      console.warn(`lang="${lang}" should be placed on <html> instead of <body>`);
    }
  }

  if (opts.lang) {
    lang = opts.lang;
  } else {
    lang = doc.documentElement.getAttribute('lang');
  }

  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.length > 0) {
      doc.documentElement.lang = lang;
    }
  }
}


export function collectAnchors(config: BuildConfig, doc: Document, results: HydrateResults) {
  const anchorElements = doc.querySelectorAll('a');

  for (var i = 0; i < anchorElements.length; i++) {
    var attrs: any = {};
    var anchorAttrs = anchorElements[i].attributes;

    for (var j = 0; j < anchorAttrs.length; j++) {
      attrs[anchorAttrs[j].nodeName.toLowerCase()] = anchorAttrs[j].nodeValue;
    }

    results.anchors.push(attrs);
  }

  config.logger.debug(`optimize ${results.pathname}, collected anchors: ${results.anchors.length}`);
}


export function generateFailureDiagnostic(d: Diagnostic) {
  return `
    <div style="padding: 20px;">
      <div style="font-weight: bold;">${d.header}</div>
      <div>${d.messageText}</div>
    </div>
  `;
}


export function getNodeDepth(elm: Node) {
  let depth = 0;

  while (elm.parentNode) {
    depth++;
    elm = elm.parentNode;
  }

  return depth;
}
