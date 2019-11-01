import { formatDiagnostic, getCompilerOptions, transpile } from '../test-transpile';


export const jestPreprocessor = {

  process(sourceText: string, filePath: string, jestConfig: { rootDir: string }) {
    if (shouldTransformDts(filePath)) {
      // .d.ts file doesn't need to be transpiled for testing
      return '';
    }

    if (shouldTransformTs(filePath) || shouldTransformEsm(filePath, sourceText)) {
      const opts = Object.assign({}, this.getCompilerOptions(jestConfig.rootDir));

      const results = transpile(sourceText, opts, filePath);

      const hasErrors = results.diagnostics.some((diagnostic) => diagnostic.level === 'error');

      if (results.diagnostics && hasErrors) {
        const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
        throw new Error(msg);
      }
      const mapObject = JSON.parse(results.map);
      mapObject.file = filePath;
      mapObject.sources = [filePath];
      delete mapObject.sourceRoot;

      const mapBase64 = Buffer.from(JSON.stringify(mapObject), 'utf8').toString('base64');
      const sourceMapInlined = `data:application/json;charset=utf-8;base64,${mapBase64}`;
      const sourceMapComment = results.code.lastIndexOf('//#');
      return results.code.slice(0, sourceMapComment) + '//# sourceMappingURL=' + sourceMapInlined;
    }

    if (shouldTransformCss(filePath)) {
      const safeContent = JSON.stringify(sourceText);
      return `module.exports = ${safeContent};`;
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

    return key.join(':');
  }
};

function shouldTransformTs(filePath: string) {
  return (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx'));
}

function shouldTransformEsm(filePath: string, sourceText: string) {
  // there may be false positives here
  // but worst case scenario a commonjs file is transpiled to commonjs
  if (filePath.endsWith('.esm.js') || filePath.endsWith('.mjs')) {
    return true;
  }
  if (filePath.endsWith('.js')) {
    if (sourceText.includes('import ') || sourceText.includes('import.') || sourceText.includes('import(')) {
      return true;
    }
    if (sourceText.includes('export ')) {
      return true;
    }
  }
  return false;
}

function shouldTransformCss(filePath: string) {
  return filePath.endsWith('.css');
}

function shouldTransformDts(filePath: string) {
  return filePath.endsWith('.d.ts');
}
