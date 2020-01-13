import { CompileOptions, CompileResults } from '../declarations';
import { catchError, isString } from '@utils';
import { getCompileConfig, getCompileOptions, getTransformOptions } from './config/compile-module-options';
import { getPublicCompilerMeta } from '../compiler/transformers/add-component-meta-static';
import { patchTypescript } from './sys/typescript/typescript-patch';
import { transformCssToEsm } from '../compiler/style/css-to-esm';
import { transpileModule } from '../compiler/transpile/transpile-module';


export const compile = async (code: string, opts: CompileOptions = {}) => {
  const r: CompileResults = {
    diagnostics: [],
    code: (isString(code) ? code : ''),
    map: null,
    inputFilePath: (isString(opts.file) ? opts.file.trim() : 'module.tsx'),
    outputFilePath: null,
    inputOptions: null,
    imports: [],
    componentMeta: []
  };

  try {
    const config = getCompileConfig();
    const filePath = r.inputFilePath;
    r.inputOptions = getCompileOptions(opts);

    if (filePath.endsWith('.d.ts')) {
      r.code = '';

    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx')) {
      await patchTypescript(config, r.diagnostics, null);

      const transformOpts = getTransformOptions(r.inputOptions);

      const transpileResults = transpileModule(config, code, transformOpts, r.inputFilePath);

      r.diagnostics.push(...transpileResults.diagnostics);

      if (isString(transpileResults.code)) {
        r.code = transpileResults.code;
      }

      r.map = transpileResults.map;

      if (isString(transpileResults.sourceFilePath)) {
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

    } else if (filePath.endsWith('.css')) {
      const cssResults = await transformCssToEsm({
        filePath,
        code: code,
        tagName: opts.data.tag,
        encapsulation: opts.data.encapsulation,
        modeName: opts.data.mode,
        sourceMap: config.sourceMap,
        commentOriginalSelector: false,
        minify: false,
        autoprefixer: false,
      });
      r.code = cssResults.code;
      r.map = cssResults.map;
      r.diagnostics.push(...cssResults.diagnostics);
    }

  } catch (e) {
    catchError(r.diagnostics, e);
  }

  return r;
};
