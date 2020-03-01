import * as d from '../declarations';
import { flatOne, unique } from '@utils';
import { getScopeId } from '../compiler/style/scope-css';
import { injectModulePreloads } from '../compiler/html/inject-module-preloads';
import { optimizeCss, optimizeJs } from '@stencil/core/compiler';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);


export function inlineExternalStyleSheets(appDir: string, doc: Document) {
  const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  return Promise.all(
    globalLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }

      const fsPath = path.join(appDir, href);

      try {
        let styles = await readFile(fsPath, 'utf8');

        const optimizeResults = await optimizeCss({
          input: styles
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

      } catch (e) {

      }
    })
  );
}

export function minifyScriptElements(doc: Document) {
  const scriptElms = (Array.from(doc.querySelectorAll('script')))
    .filter(scriptElm => {
      if (scriptElm.hasAttribute('src')) {
        return false;
      }
      const scriptType = scriptElm.getAttribute('type');
      if (typeof scriptType === 'string' && scriptType !== 'module' && scriptType !== 'text/javascript') {
        return false;
      }
      return true;
    });

  return Promise.all(scriptElms.map(async scriptElm => {
    const opts: d.OptimizeJsInput = {
      input: scriptElm.innerHTML,
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
  }));
}

export async function minifyStyleElements(doc: Document) {
  const styleElms = Array.from(doc.querySelectorAll('style'));

  await Promise.all(styleElms.map(async styleElm => {
    const optimizeResults = await optimizeCss({
      input: styleElm.innerHTML,
      minify: true,
    });
    if (optimizeResults.diagnostics.length === 0) {
      styleElm.innerHTML = optimizeResults.output;
    }
  }));
}

export function addModulePreloads(doc: Document, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>) {
  if (!componentGraph) {
    return false;
  }
  // const hasImportScript = !!doc.querySelector('script[type=module][data-resources-url]');
  // if (!hasImportScript) {
  //   return false;
  // }
  const modulePreloads = unique(
    flatOne(
      hydrateResults.components
        .map(cmp => getScopeId(cmp.tag, cmp.mode))
        .map(scopeId => componentGraph.get(scopeId) || [])
    )
  );

  injectModulePreloads(doc, modulePreloads);
  return true;
}
