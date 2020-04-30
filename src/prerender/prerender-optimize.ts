import * as d from '../declarations';
import { flatOne, unique } from '@utils';
import { getScopeId } from '../compiler/style/scope-css';
import { injectModulePreloads } from '../compiler/html/inject-module-preloads';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export async function inlineExternalStyleSheets(appDir: string, doc: Document) {
  const documentLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  if (documentLinks.length === 0) {
    return;
  }

  const { optimizeCss } = await import('@stencil/core/compiler');

  await Promise.all(
    documentLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }

      const fsPath = path.join(appDir, href);

      try {
        let styles = await readFile(fsPath, 'utf8');

        const optimizeResults = await optimizeCss({
          input: styles,
        });
        styles = optimizeResults.output;

        // insert inline <style>
        const inlinedStyles = doc.createElement('style');
        inlinedStyles.innerHTML = styles;
        link.parentNode.insertBefore(inlinedStyles, link);
        link.remove();

        // mark inlinedStyle as treeshakable
        inlinedStyles.setAttribute('data-styles', '');

        // since it's no longer a critical resource
        link.setAttribute('media', '(max-width: 0px)');
        link.setAttribute('importance', 'low');
        link.setAttribute('onload', `this.media=''`);

        // move <link rel="stylesheet"> to the end of <body>
        doc.body.appendChild(link);
      } catch (e) {}
    }),
  );
}

export async function minifyScriptElements(doc: Document) {
  const scriptElms = Array.from(doc.querySelectorAll('script')).filter(scriptElm => {
    if (scriptElm.hasAttribute('src') || scriptElm.hasAttribute('data-minified')) {
      return false;
    }
    const scriptType = scriptElm.getAttribute('type');
    if (typeof scriptType === 'string' && scriptType !== 'module' && scriptType !== 'text/javascript') {
      return false;
    }
    return true;
  });

  if (scriptElms.length === 0) {
    return;
  }

  const { optimizeJs } = await import('@stencil/core/compiler');

  await Promise.all(
    scriptElms.map(async scriptElm => {
      const content = scriptElm.innerHTML.trim();
      if (content.length > 0) {
        const opts: d.OptimizeJsInput = {
          input: content,
          sourceMap: false,
          target: 'latest',
        };

        if (scriptElm.getAttribute('type') !== 'module') {
          opts.target = 'es5';
        }

        const optimizeResults = await optimizeJs(opts);

        if (optimizeResults.diagnostics.length === 0) {
          scriptElm.innerHTML = optimizeResults.output;
        }

        scriptElm.setAttribute('data-minified', '');
      }
    }),
  );
}

export async function minifyStyleElements(doc: Document) {
  const styleElms = Array.from(doc.querySelectorAll('style')).filter(styleElm => {
    if (styleElm.hasAttribute('data-minified')) {
      return false;
    }
    return true;
  });

  if (styleElms.length === 0) {
    return;
  }

  const { optimizeCss } = await import('@stencil/core/compiler');

  await Promise.all(
    styleElms.map(async styleElm => {
      const content = styleElm.innerHTML.trim();
      if (content.length > 0) {
        const optimizeResults = await optimizeCss({
          input: content,
          minify: true,
        });
        if (optimizeResults.diagnostics.length === 0) {
          styleElm.innerHTML = optimizeResults.output;
        }
        styleElm.setAttribute('data-minified', '');
      }
    }),
  );
}

export function addModulePreloads(doc: Document, hydrateOpts: d.PrerenderHydrateOptions, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>) {
  if (!componentGraph) {
    return false;
  }

  const staticComponents = hydrateOpts.staticComponents || [];

  const cmpTags = hydrateResults.components.filter(cmp => !staticComponents.includes(cmp.tag));

  const modulePreloads = unique(flatOne(cmpTags.map(cmp => getScopeId(cmp.tag, cmp.mode)).map(scopeId => componentGraph.get(scopeId) || [])));

  injectModulePreloads(doc, modulePreloads);
  return true;
}

export function removeStencilScripts(doc: Document) {
  const stencilScripts = doc.querySelectorAll('script[data-stencil]');
  for (let i = stencilScripts.length - 1; i >= 0; i--) {
    stencilScripts[i].remove();
  }
}

export function hasStencilScript(doc: Document) {
  return !!doc.querySelector('script[data-stencil]');
}
