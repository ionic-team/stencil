import * as d from '../declarations';


export function normalizeHydrateOptions(wwwTarget: d.OutputTargetWww, opts: d.HydrateOptions) {
  const hydrateTarget: d.OutputTargetHydrate = Object.assign({}, wwwTarget);
  hydrateTarget.prerenderLocations = wwwTarget.prerenderLocations.map(p => Object.assign({}, p));

  hydrateTarget.hydrateComponents = true;

  const req = opts.req;
  if (req && typeof req.get === 'function') {
    // assuming node express request object
    // https://expressjs.com/
    if (!opts.url) opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!opts.referrer) opts.referrer = req.get('referrer');
    if (!opts.userAgent) opts.userAgent = req.get('user-agent');
    if (!opts.cookie) opts.cookie = req.get('cookie');
  }

  Object.assign(hydrateTarget, opts);

  return hydrateTarget;
}


export function generateHydrateResults(config: d.Config, hydrateTarget: d.OutputTargetHydrate) {
  if (!hydrateTarget.url) {
    hydrateTarget.url = `https://hydrate.stenciljs.com/`;
  }

  // https://nodejs.org/api/url.html
  const urlParse =  config.sys.url.parse(hydrateTarget.url);

  const hydrateResults: d.HydrateResults = {
    diagnostics: [],
    url: hydrateTarget.url,
    host: urlParse.host,
    hostname: urlParse.hostname,
    port: urlParse.port,
    path: urlParse.path,
    pathname: urlParse.pathname,
    search: urlParse.search,
    query: urlParse.query,
    hash: urlParse.hash,
    html: hydrateTarget.html,
    styles: null,
    anchors: [],
    components: [],
    styleUrls: [],
    scriptUrls: [],
    imgUrls: []
  };

  createConsole(config, hydrateTarget, hydrateResults);

  return hydrateResults;
}


function createConsole(config: d.Config, opts: d.HydrateOptions, results: d.HydrateResults) {
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

  if (config.logLevel === 'debug') {
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


export function normalizeDirection(doc: Document, hydrateTarget: d.OutputTargetHydrate) {
  let dir = doc.body.getAttribute('dir');
  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir.trim().length > 0) {
      console.warn(`dir="${dir}" should be placed on the <html> instead of <body>`);
    }
  }

  if (hydrateTarget.direction) {
    dir = hydrateTarget.direction;
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


export function normalizeLanguage(doc: Document, hydrateTarget: d.OutputTargetHydrate) {
  let lang = doc.body.getAttribute('lang');
  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.trim().length > 0) {
      console.warn(`lang="${lang}" should be placed on <html> instead of <body>`);
    }
  }

  if (hydrateTarget.language) {
    lang = hydrateTarget.language;
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


export function collectAnchors(config: d.Config, doc: Document, results: d.HydrateResults) {
  const anchorElements = doc.querySelectorAll('a');

  for (var i = 0; i < anchorElements.length; i++) {
    const attrs: any = {};
    const anchorAttrs = anchorElements[i].attributes;

    for (var j = 0; j < anchorAttrs.length; j++) {
      attrs[anchorAttrs[j].nodeName.toLowerCase()] = anchorAttrs[j].nodeValue;
    }

    results.anchors.push(attrs);
  }

  config.logger.debug(`optimize ${results.pathname}, collected anchors: ${results.anchors.length}`);
}


export function generateFailureDiagnostic(diagnostic: d.Diagnostic) {
  return `
    <div style="padding: 20px;">
      <div style="font-weight: bold;">${diagnostic.header}</div>
      <div>${diagnostic.messageText}</div>
    </div>
  `;
}
