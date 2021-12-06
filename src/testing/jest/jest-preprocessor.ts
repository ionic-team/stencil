import type { TranspileOptions, Diagnostic } from '@stencil/core/internal';
import { loadTypeScriptDiagnostic, normalizePath } from '@utils';
import { transpile } from '../test-transpile';
import { ts } from '@stencil/core/compiler';

export const jestPreprocessor = {
  process(sourceText: string, filePath: string, jestConfig: { rootDir: string }) {
    if (shouldTransform(filePath, sourceText)) {
      const opts: TranspileOptions = {
        file: filePath,
        currentDirectory: jestConfig.rootDir,
      };

      const tsCompilerOptions: ts.CompilerOptions = this.getCompilerOptions(jestConfig.rootDir);
      if (tsCompilerOptions) {
        if (tsCompilerOptions.baseUrl) {
          opts.baseUrl = tsCompilerOptions.baseUrl;
        }
        if (tsCompilerOptions.paths) {
          opts.paths = tsCompilerOptions.paths;
        }
      }

      const results = transpile(sourceText, opts);

      const hasErrors = results.diagnostics.some((diagnostic) => diagnostic.level === 'error');

      if (results.diagnostics && hasErrors) {
        const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
        throw new Error(msg);
      }

      return results.code;
    }

    return sourceText;
  },

  getCompilerOptions(rootDir: string) {
    if (!this._tsCompilerOptions) {
      this._tsCompilerOptions = getCompilerOptions(rootDir);
    }

    return this._tsCompilerOptions;
  },

  getCacheKey(
    code: string,
    filePath: string,
    jestConfigStr: string,
    transformOptions: { instrument: boolean; rootDir: string }
  ) {
    // https://github.com/facebook/jest/blob/v23.6.0/packages/jest-runtime/src/script_transformer.js#L61-L90
    if (!this._tsCompilerOptionsKey) {
      const opts = this.getCompilerOptions(transformOptions.rootDir);
      this._tsCompilerOptionsKey = JSON.stringify(opts);
    }

    const key = [
      process.version,
      this._tsCompilerOptionsKey,
      code,
      filePath,
      jestConfigStr,
      !!transformOptions.instrument,
      6, // cache buster
    ];

    return key.join(':');
  },
};

function formatDiagnostic(diagnostic: Diagnostic) {
  let m = '';

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

function getCompilerOptions(rootDir: string) {
  if (typeof rootDir !== 'string') {
    return null;
  }

  rootDir = normalizePath(rootDir);

  const tsconfigFilePath = ts.findConfigFile(rootDir, ts.sys.fileExists);
  if (!tsconfigFilePath) {
    return null;
  }

  const tsconfigResults = ts.readConfigFile(tsconfigFilePath, ts.sys.readFile);

  if (tsconfigResults.error) {
    throw new Error(formatDiagnostic(loadTypeScriptDiagnostic(tsconfigResults.error)));
  }

  const parseResult = ts.parseJsonConfigFileContent(
    tsconfigResults.config,
    ts.sys,
    rootDir,
    undefined,
    tsconfigFilePath
  );

  return parseResult.options;
}

export function shouldTransform(filePath: string, sourceText: string) {
  const ext = filePath.split('.').pop().toLowerCase().split('?')[0];

  if (ext === 'ts' || ext === 'tsx' || ext === 'jsx') {
    // typescript extensions (to include .d.ts)
    return true;
  }
  if (ext === 'mjs') {
    // es module extensions
    return true;
  }
  if (ext === 'js') {
    // there may be false positives here
    // but worst case scenario a commonjs file is transpiled to commonjs
    if (sourceText.includes('import ') || sourceText.includes('import.') || sourceText.includes('import(')) {
      return true;
    }
    if (sourceText.includes('export ')) {
      return true;
    }
  }
  if (ext === 'css') {
    // convert a standard css file into an nodejs ready file
    return true;
  }
  return false;
}
