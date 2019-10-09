import { CompileOptions, CompileResults } from '../declarations';
import { catchError } from '@utils';
import { getCompileConfig, getCompileOptions, getTransformOptions } from './config/compile-module-options';
import { getPublicCompilerMeta } from '../compiler/transformers/add-component-meta-static';
import { patchTypescript } from './sys/typescript-patch';
import { transformCssToEsm } from '../compiler/style/css-to-esm';
import { transpileModule } from '../compiler/transpile/transpile-module';


export const compile = async (code: string, opts: CompileOptions = {}): Promise<CompileResults> => {
  const r: CompileResults = {
    diagnostics: [],
    code: (typeof code === 'string' ? code : ''),
    map: null,
    inputFilePath: (typeof opts.file === 'string' ? opts.file.trim() : 'module.tsx'),
    outputFilePath: null,
    inputOptions: null,
    imports: [],
    componentMeta: []
  };

  try {
    const config = getCompileConfig();
    r.inputOptions = getCompileOptions(opts, r.inputFilePath);

    if (r.inputOptions.type === 'tsx' || r.inputOptions.type === 'ts' || r.inputOptions.type === 'jsx') {
      patchTypescript(config, r.diagnostics, null);

      const transformOpts = getTransformOptions(r.inputOptions);

      const transpileResults = transpileModule(config, code, transformOpts, r.inputFilePath);

      r.diagnostics.push(...transpileResults.diagnostics);

      if (typeof transpileResults.code === 'string') {
        r.code = transpileResults.code;
      }

      r.map = transpileResults.map;

      if (typeof transpileResults.sourceFilePath === 'string') {
        r.inputFilePath = transpileResults.sourceFilePath;
      }

      const moduleFile = transpileResults.moduleFile;
      if (moduleFile) {
        r.outputFilePath = moduleFile.jsFilePath;

        moduleFile.cmps.forEach(cmp => {
          r.componentMeta.push(getPublicCompilerMeta(cmp));
        });

        moduleFile.originalImports.forEach(originalImport => {
          r.imports.push({
            path: originalImport
          });
        });
      }

    } else if (r.inputOptions.type === 'dts') {
      r.code = '';
      r.map = null;

    } else if (r.inputOptions.type === 'css') {
      const styleData = opts.data;
      const cssResults = transformCssToEsm(config, code, r.inputFilePath, styleData.tag, styleData.encapsulation, styleData.mode);
      r.code = cssResults.code;
      r.map = cssResults.map;
    }

  } catch (e) {
    catchError(r.diagnostics, e);
  }

  return r;
};
