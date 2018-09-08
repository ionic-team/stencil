import * as d from '../../declarations';
import { transpile } from '../test-transpile';
import * as ts from 'typescript';


export const jestPreprocessor = {

  process(sourceText: string, filePath: string) {

    if (filePath.endsWith('.d.ts')) {
      // .d.ts file doesn't need to be transpiled for testing
      return '';
    }

    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      const opts: any = {
        module: 'commonjs',
        target: 'es2015'
      };

      if (filePath.endsWith('.tsx')) {
        opts.jsx = ts.JsxEmit.React;
        opts.jsxFactory = 'h';
        opts.esModuleInterop = true;
      }

      const results = transpile(sourceText, opts, filePath);
      if (results.diagnostics && results.diagnostics.length > 0) {
        const msg = results.diagnostics.map(formatDiagnostics).join('\n\n');
        throw new Error(msg);
      }

      return {
        code: results.code,
        map: results.map
      };
    }

    return sourceText;
  }

};


function formatDiagnostics(diagnostic: d.Diagnostic) {
  var m = '';

  if (diagnostic.relFilePath) {
    m += diagnostic.relFilePath;
    if (typeof diagnostic.lineNumber === 'number') {
      m += ':' + diagnostic.lineNumber + 1;
      if (typeof diagnostic.columnNumber === 'number') {
        m += ':' + diagnostic.columnNumber;
      }
    }
    m += '\n';
  }

  m += diagnostic.messageText;

  return m;
}
