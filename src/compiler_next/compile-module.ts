import { CompileOptions, CompileResults, Config, TransformOptions } from '../declarations';
import { catchError, isString } from '@utils';
import { getCompileConfig } from './config/compile-module-options';
import { getPublicCompilerMeta } from '../compiler/transformers/add-component-meta-static';
import { patchTypescript, patchTypescriptSync } from './sys/typescript/typescript-patch';
import { transformCssToEsm } from '../compiler/style/css-to-esm';
import { transpileModule } from '../compiler/transpile/transpile-module';


export const compile = async (code: string, opts: CompileOptions = {}) => {
  const { config, compileOpts, results, transformOpts } = getCompileConfig(code, opts);

  try {
    if (shouldTranspileCode(results.inputFileExtension)) {
      await patchTypescript(config, results.diagnostics, null);
      compileModule(config, compileOpts, transformOpts, results);

    } else if (results.inputFileExtension === 'd.ts') {
      results.code = '';

    } else if (results.inputFileExtension === 'css') {
      await compileCss(opts, results);
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};

export const compileSync = (code: string, opts: CompileOptions = {}) => {
  const { config, compileOpts, results, transformOpts } = getCompileConfig(code, opts);

  try {
    if (shouldTranspileCode(results.inputFileExtension)) {
      patchTypescriptSync(config, results.diagnostics, null);
      compileModule(config, compileOpts, transformOpts, results);

    } else if (results.inputFileExtension === 'd.ts') {
      results.code = '';
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

    } else if (compileOpts.sourceMap) {
      results.map = transpileResults.map;
    }
  }

  if (isString(transpileResults.sourceFilePath)) {
    results.inputFilePath = transpileResults.sourceFilePath;
  }

  const moduleFile = transpileResults.moduleFile;
  if (moduleFile) {
    results.outputFilePath = moduleFile.jsFilePath;

    moduleFile.cmps.forEach(cmp => {
      results.componentMeta.push(getPublicCompilerMeta(cmp));
    });

    moduleFile.originalImports.forEach(originalImport => {
      results.imports.push({
        path: originalImport
      });
    });
  }
};

const compileCss = async (opts: CompileOptions, r: CompileResults) => {
  const cssResults = await transformCssToEsm({
    filePath: r.inputFilePath,
    code: r.code,
    tagName: opts.data.tag,
    encapsulation: opts.data.encapsulation,
    modeName: opts.data.mode,
    sourceMap: (opts.sourceMap !== false),
    commentOriginalSelector: false,
    minify: false,
    autoprefixer: false,
  });

  r.code = cssResults.code;
  r.map = cssResults.map;
  r.diagnostics.push(...cssResults.diagnostics);
};

const shouldTranspileCode = (ext: string) => (
  ext === 'tsx' ||
  ext === 'ts' ||
  ext === 'js' ||
  ext === 'jsx'
);
