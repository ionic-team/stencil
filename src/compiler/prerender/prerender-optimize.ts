import * as d from '../../declarations';
import { flatOne, unique } from '@utils';
import { getScopeId } from '../style/scope-css';
import { injectModulePreloads } from '../html/inject-module-preloads';
import { optimizeCss } from '../optimize/optimize-css';
import { optimizeJs } from '../optimize/optimize-js';
import { join } from 'path';

export const inlineExternalStyleSheets = async (config: d.Config, appDir: string, doc: Document) => {
  const documentLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  if (documentLinks.length === 0) {
    return;
  }

  await Promise.all(
    documentLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }

      const fsPath = join(appDir, href);

      try {
        let styles = await config.sys.readFile(fsPath);

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
};

export const minifyScriptElements = async (doc: Document, addMinifiedAttr: boolean) => {
  const scriptElms = Array.from(doc.querySelectorAll('script')).filter(scriptElm => {
    if (scriptElm.hasAttribute('src') || scriptElm.hasAttribute(dataMinifiedAttr)) {
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

        if (addMinifiedAttr) {
          scriptElm.setAttribute(dataMinifiedAttr, '');
        }
      }
    }),
  );
};

export const minifyStyleElements = async (doc: Document, addMinifiedAttr: boolean) => {
  const styleElms = Array.from(doc.querySelectorAll('style')).filter(styleElm => {
    if (styleElm.hasAttribute(dataMinifiedAttr)) {
      return false;
    }
    return true;
  });

  if (styleElms.length === 0) {
    return;
  }

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
        if (addMinifiedAttr) {
          styleElm.setAttribute(dataMinifiedAttr, '');
        }
      }
    }),
  );
};

export const excludeStaticComponents = (doc: Document, hydrateOpts: d.PrerenderHydrateOptions, hydrateResults: d.HydrateResults) => {
  const staticComponents = hydrateOpts.staticComponents.filter(tag => {
    return hydrateResults.components.some(cmp => cmp.tag === tag);
  });

  if (staticComponents.length > 0) {
    const stencilScriptElm = doc.querySelector('script[data-stencil-namespace]');
    if (stencilScriptElm) {
      const namespace = stencilScriptElm.getAttribute('data-stencil-namespace');
      let scriptContent = excludeComponentScript.replace('__NAMESPACE__', namespace);
      scriptContent = scriptContent.replace('__EXCLUDE__', JSON.stringify(staticComponents));

      const dataOptsScript = doc.createElement('script');
      dataOptsScript.innerHTML = scriptContent;
      dataOptsScript.setAttribute(dataMinifiedAttr, '');

      stencilScriptElm.parentNode.insertBefore(dataOptsScript, stencilScriptElm.nextSibling);
    }
  }
};

const excludeComponentScript = `
(function(){
var s=document.querySelector('[data-stencil-namespace="__NAMESPACE__"]');
s&&((s['data-opts']=s['data-opts']||{}).exclude=__EXCLUDE__);
})();
`
  .replace(/\n/g, '')
  .trim();

export const addModulePreloads = (doc: Document, hydrateOpts: d.PrerenderHydrateOptions, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>) => {
  if (!componentGraph) {
    return false;
  }

  const staticComponents = hydrateOpts.staticComponents || [];

  const cmpTags = hydrateResults.components.filter(cmp => !staticComponents.includes(cmp.tag));

  const modulePreloads = unique(flatOne(cmpTags.map(cmp => getScopeId(cmp.tag, cmp.mode)).map(scopeId => componentGraph.get(scopeId) || [])));

  injectModulePreloads(doc, modulePreloads);
  return true;
};

export const removeModulePreloads = (doc: Document) => {
  const links = doc.querySelectorAll('link[rel="modulepreload"]');
  for (let i = links.length - 1; i >= 0; i--) {
    const href = links[i].getAttribute('href');
    if (href && href.includes('/p-')) {
      links[i].remove();
    }
  }
};

export const removeStencilScripts = (doc: Document) => {
  const stencilScripts = doc.querySelectorAll('script[data-stencil]');
  for (let i = stencilScripts.length - 1; i >= 0; i--) {
    stencilScripts[i].remove();
  }
};

export const hasStencilScript = (doc: Document) => {
  return !!doc.querySelector('script[data-stencil]');
};

const dataMinifiedAttr = 'data-m';
