import { TranspileOptions, TranspileResults, Config, TransformOptions, TransformCssToEsmInput } from '../declarations';
import { catchError, getInlineSourceMappingUrlLinker, isString } from '@utils';
import { getPublicCompilerMeta } from './transformers/add-component-meta-static';
import { getTranspileCssConfig, getTranspileConfig, getTranspileResults } from './config/transpile-options';
import { patchTypescript } from './sys/typescript/typescript-sys';
import { rollupPluginUtils } from '@compiler-deps';
import { transformCssToEsm, transformCssToEsmSync } from './style/css-to-esm';
import { transpileModule } from './transpile/transpile-module';

export const transpile = async (code: string, opts: TranspileOptions = {}) => {
  const { importData, results } = getTranspileResults(code, opts);

  try {
    if (shouldTranspileModule(results.inputFileExtension)) {
      const { config, compileOpts, transformOpts } = getTranspileConfig(opts);
      patchTypescript(config, null);
      transpileCode(config, compileOpts, transformOpts, results);
    } else if (results.inputFileExtension === 'd.ts') {
      results.code = '';
    } else if (results.inputFileExtension === 'css') {
      const transformInput = getTranspileCssConfig(opts, importData, results);
      await transpileCss(transformInput, results);
    } else if (results.inputFileExtension === 'json') {
      transpileJson(results);
    }
  } catch (e: any) {
    catchError(results.diagnostics, e);
  }

  return results;
};

export const transpileSync = (code: string, opts: TranspileOptions = {}) => {
  const { importData, results } = getTranspileResults(code, opts);

  try {
    if (shouldTranspileModule(results.inputFileExtension)) {
      const { config, compileOpts, transformOpts } = getTranspileConfig(opts);
      patchTypescript(config, null);
      transpileCode(config, compileOpts, transformOpts, results);
    } else if (results.inputFileExtension === 'd.ts') {
      results.code = '';
    } else if (results.inputFileExtension === 'css') {
      const transformInput = getTranspileCssConfig(opts, importData, results);
      transpileCssSync(transformInput, results);
    } else if (results.inputFileExtension === 'json') {
      transpileJson(results);
    }
  } catch (e: any) {
    catchError(results.diagnostics, e);
  }

  return results;
};

const transpileCode = (
  config: Config,
  transpileOpts: TranspileOptions,
  transformOpts: TransformOptions,
  results: TranspileResults
) => {
  const transpileResults = transpileModule(config, results.code, transformOpts);

  results.diagnostics.push(...transpileResults.diagnostics);

  if (typeof transpileResults.code === 'string') {
    results.code = transpileResults.code;
    results.map = transpileResults.map;

    if (transpileOpts.sourceMap === 'inline') {
      try {
        const mapObject = JSON.parse(transpileResults.map);
        mapObject.file = transpileOpts.file;
        mapObject.sources = [transpileOpts.file];
        delete mapObject.sourceRoot;

        const sourceMapComment = results.code.lastIndexOf('//#');
        results.code =
          results.code.slice(0, sourceMapComment) + getInlineSourceMappingUrlLinker(JSON.stringify(mapObject));
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (isString(transpileResults.sourceFilePath)) {
    results.inputFilePath = transpileResults.sourceFilePath;
  }

  const moduleFile = transpileResults.moduleFile;
  if (moduleFile) {
    results.outputFilePath = moduleFile.jsFilePath;

    moduleFile.cmps.forEach((cmp) => {
      results.data.push(getPublicCompilerMeta(cmp));
    });

    moduleFile.originalImports.forEach((originalImport) => {
      results.imports.push({
        path: originalImport,
      });
    });
  }
};

const transpileCss = async (transformInput: TransformCssToEsmInput, results: TranspileResults) => {
  const cssResults = await transformCssToEsm(transformInput);
  results.code = cssResults.output;
  results.map = cssResults.map;
  results.imports = cssResults.imports.map((p) => ({ path: p.importPath }));
  results.diagnostics.push(...cssResults.diagnostics);
};

const transpileCssSync = (transformInput: TransformCssToEsmInput, results: TranspileResults) => {
  const cssResults = transformCssToEsmSync(transformInput);
  results.code = cssResults.output;
  results.map = cssResults.map;
  results.imports = cssResults.imports.map((p) => ({ path: p.importPath }));
  results.diagnostics.push(...cssResults.diagnostics);
};

const transpileJson = (results: TranspileResults) => {
  results.code = rollupPluginUtils.dataToEsm(JSON.parse(results.code), {
    preferConst: true,
    compact: false,
    indent: '  ',
  });
  results.map = { mappings: '' };
};

// NOTE: if you change this, also change scripts/bundles/helpers/jest/jest-preset.js
const shouldTranspileModule = (ext: string) => ['tsx', 'ts', 'mjs', 'jsx', 'js'].includes(ext);
