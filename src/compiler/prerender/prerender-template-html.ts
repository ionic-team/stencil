import * as d from '../../declarations';
import { catchError } from '@utils';

export async function generateTemplateHtml(config: d.Config, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  try {
    const templateHtml = await config.sys.fs.readFile(outputTarget.indexHtml);
    const templateDoc = config.sys.createDocument(templateHtml);
    validateTemplateHtml(config, buildCtx, templateDoc);
    await inlineStyleSheets(config, templateDoc, outputTarget);
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
      const fsPath = config.sys.path.join(outputTarget.dir, href);
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
      link.setAttribute('importance', 'low');

      // move <link rel="stylesheet"> to the end of <body>
      doc.body.appendChild(link);
    })
  );
}