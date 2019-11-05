import * as d from '../../declarations';
import { catchError } from '@utils';


export async function generateTemplateHtml(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  try {
    const templateHtml = await config.sys.fs.readFile(outputTarget.indexHtml);
    const templateDoc = config.sys.createDocument(templateHtml);

    validateTemplateHtml(config, buildCtx, templateDoc);

    await inlineStyleSheets(config, templateDoc, outputTarget);

    if (config.minifyJs && config.logLevel !== 'debug') {
      await minifyScriptElements(config, templateDoc);
    }

    return config.sys.serializeNodeToHtml(templateDoc);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
  return undefined;
}


function validateTemplateHtml(_config: d.Config, _buildCtx: d.BuildCtx, _doc: Document) {
  // TODO
}


function inlineStyleSheets(config: d.Config, doc: Document, outputTarget: d.OutputTargetWww) {
  const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  return Promise.all(
    globalLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }
      const fsPath = config.sys.path.join(outputTarget.appDir, href);
      if (!config.sys.fs.existsSync(fsPath)) {
        return;
      }
      const styles = await config.sys.fs.readFile(fsPath);

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
    })
  );
}


function minifyScriptElements(config: d.Config, doc: Document) {
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
