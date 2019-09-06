import { formatDiagnostic, getCompilerOptions, transpile } from '../test-transpile';
import { basename } from 'path';


export const jestPreprocessor = {

  process(sourceText: string, filePath: string, jestConfig: { rootDir: string }) {
    if (filePath.endsWith('.d.ts')) {
      // .d.ts file doesn't need to be transpiled for testing
      return '';
    }

    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      const opts = Object.assign({}, this.getCompilerOptions(jestConfig.rootDir));

      const results = transpile(sourceText, opts, filePath);

      const hasErrors = results.diagnostics.some((diagnostic) => diagnostic.level === 'error');

      if (results.diagnostics && hasErrors) {
        const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
        throw new Error(msg);
      }
      const mapObject = JSON.parse(results.map);
      const base = basename(filePath);
      mapObject.file = filePath;
      mapObject.sources = [filePath];
      delete mapObject.sourceRoot;

      const mapBase64 = Buffer.from(JSON.stringify(mapObject), 'utf8').toString('base64');
      const sourceMapInlined = `data:application/json;charset=utf-8;base64,${mapBase64}`;
      const sourceMapLength = `${base}.map`.length;

      return results.code.slice(0, -sourceMapLength) + sourceMapInlined;
    }

    return sourceText;
  },

  getCompilerOptions(rootDir: string) {
    if (!this._tsCompilerOptions) {
      this._tsCompilerOptions = getCompilerOptions(rootDir);
    }

    return this._tsCompilerOptions;
  },

  getCacheKey(code: string, filePath: string, jestConfigStr: string, transformOptions: { instrument: boolean; rootDir: string }) {
    // https://github.com/facebook/jest/blob/v23.6.0/packages/jest-runtime/src/script_transformer.js#L61-L90
    if (!this._tsCompilerOptionsKey) {
      const opts = this.getCompilerOptions(transformOptions.rootDir);
      this._compilerOptionsKey = JSON.stringify(opts);
    }

    const key = [
      process.version,
      this._tsCompilerOptionsKey,
      code,
      filePath,
      jestConfigStr,
      !!transformOptions.instrument
    ];

    return key.join(':') + Math.random();
  }

};
