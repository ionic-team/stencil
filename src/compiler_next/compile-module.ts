import { CompileOptions, CompileResults, Config, TransformOptions, TransformCssToEsmInput } from '../declarations';
import { catchError, isString } from '@utils';
import { getCompileCssConfig, getCompileModuleConfig, getCompileResults } from './config/compile-module-options';
import { getPublicCompilerMeta } from '../compiler/transformers/add-component-meta-static';
import { patchTypescript, patchTypescriptSync } from './sys/typescript/typescript-patch';
import { transformCssToEsm, transformCssToEsmSync } from '../compiler/style/css-to-esm';
import { transpileModule } from '../compiler/transpile/transpile-module';


export const compile = async (code: string, opts: CompileOptions = {}) => {
  const { importData, results } = getCompileResults(code, opts);

  try {
    if (shouldTranspileCode(results.inputFileExtension)) {
      const { config, compileOpts, transformOpts } = getCompileModuleConfig(opts);
      await patchTypescript(config, results.diagnostics, null);
      compileModule(config, compileOpts, transformOpts, results);

    } else if (results.inputFileExtension === 'css') {
      const transformInput = getCompileCssConfig(opts, importData, results);
      await compileCss(transformInput, results);
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};

export const compileSync = (code: string, opts: CompileOptions = {}) => {
  const { importData, results } = getCompileResults(code, opts);

  try {
    if (shouldTranspileCode(results.inputFileExtension)) {
      const { config, compileOpts, transformOpts } = getCompileModuleConfig(opts);
      patchTypescriptSync(config, results.diagnostics, null);
      compileModule(config, compileOpts, transformOpts, results);

    } else if (results.inputFileExtension === 'css') {
      const transformInput = getCompileCssConfig(opts, importData, results);
      compileCssSync(transformInput, results);
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};

const compileModule = (config: Config, compileOpts: CompileOptions, transformOpts: TransformOptions, results: CompileResults) => {
  const transpileResults = transpileModule(config, results.code, transformOpts);

  results.diagnostics.push(...transpileResults.diagnostics);

  if (typeof transpileResults.code === 'string') {
    results.code = transpileResults.code;
    results.map = transpileResults.map;

    if (compileOpts.sourceMap === 'inline') {
      try {
        const mapObject = JSON.parse(transpileResults.map);
        mapObject.file = compileOpts.file;
        mapObject.sources = [compileOpts.file];
        delete mapObject.sourceRoot;

        const mapBase64 = Buffer.from(JSON.stringify(mapObject), 'utf8').toString('base64');
        const sourceMapInlined = `data:application/json;charset=utf-8;base64,` + mapBase64;
        const sourceMapComment = results.code.lastIndexOf('//#');
        results.code = results.code.slice(0, sourceMapComment) + '//# sourceMappingURL=' + sourceMapInlined;
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

    moduleFile.cmps.forEach(cmp => {
      results.data.push(getPublicCompilerMeta(cmp));
    });

    moduleFile.originalImports.forEach(originalImport => {
      results.imports.push({
        path: originalImport
      });
    });
  }
};

const compileCss = async (transformInput: TransformCssToEsmInput, results: CompileResults) => {
  const cssResults = await transformCssToEsm(transformInput);
  results.code = cssResults.output;
  results.map = cssResults.map;
  results.imports = cssResults.imports.map(p => ({ path: p.importPath }));
  results.diagnostics.push(...cssResults.diagnostics);
};

const compileCssSync = (transformInput: TransformCssToEsmInput, results: CompileResults) => {
  const cssResults = transformCssToEsmSync(transformInput);
  results.code = cssResults.output;
  results.map = cssResults.map;
  results.imports = cssResults.imports.map(p => ({ path: p.importPath }));
  results.diagnostics.push(...cssResults.diagnostics);
};

const shouldTranspileCode = (ext: string) => (
  ext === 'tsx' ||
  ext === 'ts' ||
  ext === 'js' ||
  ext === 'jsx'
);
