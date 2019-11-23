import * as d from '@stencil/core/internal';

export const logDiagnostics = (diagnostics: d.Diagnostic[]) => {
  diagnostics.forEach(d => {
    if (d.level === 'error') {
      console.error(d.messageText);
    } else if (d.level === 'warn') {
      console.warn(d.messageText);
    } else {
      console.info(d.messageText);
    }
  });
};
