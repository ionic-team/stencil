import * as d from '../declarations';
import { buildError, catchError, requireFunc, loadTypeScriptDiagnostics } from '@utils';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

export function getPrerenderConfig(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  const prerenderConfig: d.PrerenderConfig = {};

  if (typeof prerenderConfigPath === 'string') {
    const userPrerenderConfig = requireTsConfigFile(diagnostics, prerenderConfigPath);
    if (userPrerenderConfig) {
      Object.assign(prerenderConfig, userPrerenderConfig);
    }
  }

  return prerenderConfig;
}

let cachedPrerenderConfig: d.PrerenderConfig = null;

function requireTsConfigFile(diagnostics: d.Diagnostic[], prerenderConfigPath: string) {
  if (!cachedPrerenderConfig) {
    try {
      // ensure we cleared out node's internal require() cache for this file
      delete require.cache[path.resolve(prerenderConfigPath)];

      // let's override node's require for a second
      // don't worry, we'll revert this when we're done
      require.extensions['.ts'] = (module: NodeModuleWithCompile, filename: string) => {
        let sourceText = fs.readFileSync(filename, 'utf8');

        if (prerenderConfigPath.endsWith('.ts')) {
          // looks like we've got a typed config file
          // let's transpile it to .js quick
          // const ts = require('typescript');
          const tsResults = ts.transpileModule(sourceText, {
            compilerOptions: {
              module: ts.ModuleKind.CommonJS,
              target: ts.ScriptTarget.ES2017,
            },
          });
          sourceText = tsResults.outputText;

          if (tsResults.diagnostics.length > 0) {
            diagnostics.push(...loadTypeScriptDiagnostics(tsResults.diagnostics));
          }
        } else {
          // quick hack to turn a modern es module
          // into and old school commonjs module
          sourceText = sourceText.replace(/export\s+\w+\s+(\w+)/gm, 'exports.$1');
        }

        module._compile(sourceText, filename);
      };

      // let's do this!
      const m = requireFunc(prerenderConfigPath);
      if (m != null && typeof m === 'object') {
        if (m.config != null && typeof m.config === 'object') {
          cachedPrerenderConfig = m.config;
        } else {
          cachedPrerenderConfig = m;
        }
      }
    } catch (e) {
      catchError(diagnostics, e);
    }

    // all set, let's go ahead and reset the require back to the default
    require.extensions['.ts'] = undefined;
  }

  return cachedPrerenderConfig;
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
        requireTsConfigFile(diagnostics, prerenderConfigPath);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }
  }
}

export function getHydrateOptions(prerenderConfig: d.PrerenderConfig, url: URL, diagnostics: d.Diagnostic[]) {
  const prerenderUrl = url.href;

  const opts: d.PrerenderHydrateOptions = {
    url: prerenderUrl,
    addModulePreloads: true,
    approximateLineWidth: 100,
    inlineExternalStyleSheets: true,
    minifyScriptElements: true,
    minifyStyleElements: true,
    removeAttributeQuotes: true,
    removeBooleanAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeHtmlComments: true,
  };

  if (prerenderConfig.canonicalUrl === null || (prerenderConfig.canonicalUrl as any) === false) {
    opts.canonicalUrl = null;
  } else if (typeof prerenderConfig.canonicalUrl === 'function') {
    try {
      opts.canonicalUrl = prerenderConfig.canonicalUrl(url);
    } catch (e) {
      catchError(diagnostics, e);
    }
  } else {
    opts.canonicalUrl = prerenderUrl;
  }

  if (typeof prerenderConfig.hydrateOptions === 'function') {
    try {
      const userOpts = prerenderConfig.hydrateOptions(url);
      if (userOpts != null) {
        if (userOpts.prettyHtml && typeof userOpts.removeAttributeQuotes !== 'boolean') {
          opts.removeAttributeQuotes = false;
        }
        Object.assign(opts, userOpts);
      }
    } catch (e) {
      catchError(diagnostics, e);
    }
  }

  return opts;
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
