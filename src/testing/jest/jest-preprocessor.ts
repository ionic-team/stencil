import { formatDiagnostic, getCompilerOptions, transpile } from '../test-transpile';


export const jestPreprocessor = {

  process(sourceText: string, filePath: string, jestConfig: { rootDir: string }) {
    if (filePath.endsWith('.d.ts')) {
      // .d.ts file doesn't need to be transpiled for testing
      return '';
    }

    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      const opts = Object.assign({}, this.getCompilerOptions(jestConfig.rootDir));

      const results = transpile(sourceText, opts, filePath);
      if (results.diagnostics && results.diagnostics.length > 0) {
        const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
        throw new Error(msg);
      }

      return {
        code: results.code,
        map: results.map
      };
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
