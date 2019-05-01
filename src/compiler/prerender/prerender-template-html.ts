import * as d from '../../declarations';
import { catchError } from '@utils';

export async function generateTemplateHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  try {
    const templateHtml = await compilerCtx.fs.readFile(outputTarget.indexHtml);
    const templateDoc = config.sys.createDocument(templateHtml);
    validateTemplateHtml(config, buildCtx, templateDoc);
    await inlineGlobalStyles(config, compilerCtx, outputTarget, templateDoc);
    return config.sys.serializeNodeToHtml(templateDoc);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
  return undefined;
}

function validateTemplateHtml(_config: d.Config, _buildCtx: d.BuildCtx, _doc: Document) {
  // TODO
}

function inlineGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, doc: Document) {
  const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  return Promise.all(
    globalLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }
      const fsPath = config.sys.path.join(outputTarget.dir, href);
      if (!await compilerCtx.fs.access(fsPath)) {
        return;
      }

      const parent = link.parentNode;

      // insert inline <style>
      const style = doc.createElement('style');
      style.setAttribute('data-styles', '');
      style.innerHTML = await compilerCtx.fs.readFile(fsPath);
      parent.insertBefore(style, link);

      // move <link rel="stylesheet"> to the end of <body>
      link.remove();

      // since it's not longer a critical resource
      link.setAttribute('importance', 'low');
      doc.body.appendChild(link);
    })
  );
}
