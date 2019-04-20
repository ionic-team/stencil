import * as d from '../../declarations';
import { buildWarn } from '@utils';

export function validateHtml(config: d.Config, buildCtx: d.BuildCtx, doc: Document) {
  const scripts = Array.from(doc.querySelectorAll('script'));

  // Find type[module]
  const legacyFilename = `${config.fsNamespace}.js`;
  // const modernFilename = `${config.fsNamespace}.esm.js`;
  const legacyScript = scripts.find(s => s.src.includes(legacyFilename));

  if (!legacyScript) {
    const warn = buildWarn(buildCtx.diagnostics);
    warn.header = 'Update HTML';
    warn.messageText = `It's recommended to have a script`;
    warn.absFilePath = config.srcIndexHtml;
  } else {
    if (legacyScript.getAttribute('nomodule') === null) {
      const warn = buildWarn(buildCtx.diagnostics);
      warn.header = 'Update HTML';
      warn.messageText = `The index.html should now include two scripts using the modern ES Module script pattern.
      Note that only one file will actually be requested and loaded based on the browser's native support for ES Modules.
      For more info, please see https://developers.google.com/web/fundamentals/primers/modules#browser`;
      warn.absFilePath = config.srcIndexHtml;
    }
  }
}

