import * as d from '../declarations';
import { catchError } from '@utils';
import { createDocument, serializeNodeToHtml } from '@mock-doc';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);


export async function generateTemplateHtml(config: d.Config, diagnostics: d.Diagnostic[], srcIndexHtmlPath: string, outputTarget: d.OutputTargetWww) {
  try {
    if (typeof srcIndexHtmlPath !== 'string') {
      srcIndexHtmlPath = outputTarget.indexHtml;
    }
    const templateHtml = await readFile(srcIndexHtmlPath, 'utf8');
    const templateDoc = createDocument(templateHtml);

    await inlineStyleSheets(templateDoc, outputTarget);

    if (config.minifyJs && config.logLevel !== 'debug') {
      // TODO
      // await minifyScriptElements(config, templateDoc);
    }

    return serializeNodeToHtml(templateDoc);

  } catch (e) {
    catchError(diagnostics, e);
  }
  return undefined;
}


function inlineStyleSheets(doc: Document, outputTarget: d.OutputTargetWww) {
  const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  return Promise.all(
    globalLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }

      const fsPath = path.join(outputTarget.appDir, href);

      try {
        const styles = await readFile(fsPath, 'utf8');

        // insert inline <style>
        const inlinedStyles = doc.createElement('style');
        inlinedStyles.innerHTML = styles;
        link.parentNode.insertBefore(inlinedStyles, link);
        link.remove();

        // mark inlinedStyle as treeshakable
        inlinedStyles.setAttribute('data-styles', '');

        // since it's not longer a critical resource
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


export function minifyScriptElements(config: d.Config, doc: Document) {
  const scriptElms = (Array.from(doc.querySelectorAll('script')) as HTMLScriptElement[])
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
    const innerHTML = scriptElm.innerHTML;

    const opts: any = {
      output: {},
      compress: {}
    };

    if (scriptElm.getAttribute('type') === 'module') {
      opts.ecma = 7;
      opts.module = true;
      opts.output.ecma = 7;
      opts.compress.ecma = 7;
      opts.compress.arrows = true;
      opts.compress.module = true;

    } else {
      opts.ecma = 5;
      opts.output.ecma = 5;
      opts.compress.ecma = 5;
      opts.compress.arrows = false;
      opts.compress.module = false;
    }

    const results = await config.sys.minifyJs(innerHTML, opts);
    if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0) {
      scriptElm.innerHTML = results.output;
    }
  }));
}
