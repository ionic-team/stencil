import * as d from '../../declarations';
import { catchError } from '@utils';
import { getCompileOptions, getCompilerConfig, getTransformOptions } from './browser-compile-options';
import { initTypescript } from '../../sys/browser/browser-typescript';
import { transpileModule } from '../transpile/transpile-module';


export const compile = async (code: string, opts: d.CompileOptions = {}): Promise<d.CompileResults> => {
  const results: d.CompileResults = {
    diagnostics: [],
    code: (typeof code === 'string' ? code : ''),
    map: null,
    inputFilePath: (typeof opts.file === 'string' ? opts.file.trim() : 'module.tsx'),
    outputFilePath: null,
    inputOptions: null,
    imports: []
  };

  try {
    initTypescript();

    results.inputOptions = getCompileOptions(opts);

    const config = getCompilerConfig();
    const transformOpts = getTransformOptions(results.inputOptions);

    const transpileResults = transpileModule(config, code, transformOpts, results.inputFilePath);

    results.diagnostics.push(...transpileResults.diagnostics);

    if (typeof transpileResults.code === 'string') {
      results.code = transpileResults.code;
    }

    results.map = transpileResults.map;

    if (typeof transpileResults.sourceFilePath === 'string') {
      results.inputFilePath = transpileResults.sourceFilePath;
    }

    results.outputFilePath = transpileResults.moduleFile.jsFilePath;

    if (transpileResults.moduleFile) {
      transpileResults.moduleFile.originalImports.forEach(originalImport => {
        results.imports.push({
          path: originalImport
        });
      });
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
};
