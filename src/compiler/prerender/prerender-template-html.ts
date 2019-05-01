import * as d from '../../declarations';
import { catchError } from '@utils';
import { inlineStyleSheets } from '../html/inline-style-sheets';

export async function generateTemplateHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  try {
    const templateHtml = await compilerCtx.fs.readFile(outputTarget.indexHtml);
    const templateDoc = config.sys.createDocument(templateHtml);
    validateTemplateHtml(config, buildCtx, templateDoc);
    await inlineStyleSheets(config, compilerCtx, templateDoc, -1, outputTarget);
    return config.sys.serializeNodeToHtml(templateDoc);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
  return undefined;
}

function validateTemplateHtml(_config: d.Config, _buildCtx: d.BuildCtx, _doc: Document) {
  // TODO
}
