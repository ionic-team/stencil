import * as d from '../../declarations';
import { renderCatchError, renderBuildDiagnostic } from './render-utils';

export function runtimeLogging(win: Window & typeof globalThis, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  try {
    const pathname = win.location.pathname;

    win.console.error = (...msgs: any[]) => {
      renderCatchError(results, [...msgs].join(', '));
      if (opts.runtimeLogging) {
        runtimeLog(pathname, 'error', msgs);
      }
    };

    win.console.debug = (...msgs: any[]) => {
      renderBuildDiagnostic(results, 'debug', 'Hydrate Debug', [...msgs].join(', '));
      if (opts.runtimeLogging) {
        runtimeLog(pathname, 'debug', msgs);
      }
    };

    if (opts.runtimeLogging) {
      ['log', 'warn', 'assert', 'info', 'trace'].forEach(type => {
        (win.console as any)[type] = (...msgs: any[]) => {
          runtimeLog(pathname, type, msgs);
        };
      });
    }
  } catch (e) {
    renderCatchError(results, e);
  }
}

function runtimeLog(pathname: string, type: string, msgs: any[]) {
  (global.console as any)[type].apply(global.console, [`[ ${pathname}  ${type} ] `, ...msgs]);
}
