import { BuildContext, CompilerConfig } from './interfaces';
import { createFileMeta, writeFiles } from './util';
import { componentClass } from './transformers/component-class';
import { removeImports } from './transformers/remove-imports';
import * as ts from 'typescript';


export function transpile(config: CompilerConfig, ctx: BuildContext): Promise<any> {
  const tsFilePaths = getTsFilePaths(ctx);

  ctx.files.forEach(f => {
    if (f.isTsSourceFile) {
      f.transpiledCount++;
    }
  });

  return transpileFiles(tsFilePaths, config, ctx);
}


export function transpileFiles(tsFilePaths: string[], config: CompilerConfig, ctx: BuildContext): Promise<any> {
  if (!tsFilePaths.length) {
    return Promise.resolve();
  }

  if (config.debug) {
    tsFilePaths.forEach(tsFileName => {
      console.log(`compile, transpile: ${tsFileName}`);
    });
  }

  const sourcesMap = new Map<string, ts.SourceFile>();

  ctx.files.forEach((fileMeta, filePath) => {
    const sourceFile = ts.createSourceFile(filePath, fileMeta.srcText, ts.ScriptTarget.ES2015);
    sourcesMap.set(filePath, sourceFile);
  });

  const outputs = new Map<string, string>();

  const tsCompilerOptions = createTsCompilerConfigs(config);

  const tsHost: ts.CompilerHost = {
    getSourceFile: (filePath) => sourcesMap.get(filePath),
    getDefaultLibFileName: () => 'lib.d.ts',
    getCurrentDirectory: () => '',
    getDirectories: () => [],
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',

    fileExists: (filePath) => {
      return ctx.files.has(filePath);
    },

    readFile: (filePath) => {
      let fileMeta = ctx.files.get(filePath);
      if (fileMeta) {
        return fileMeta.srcText;
      }
      fileMeta = createFileMeta(config, ctx, filePath, config.packages.fs.readFileSync(filePath, 'utf-8'));
      fileMeta.recompileOnChange = true;
      return fileMeta.srcText;
    },

    writeFile: (jsFilePath: string, jsText: string, writeByteOrderMark: boolean, onError: any, sourceFiles: ts.SourceFile[]): void => {
      sourceFiles.forEach(s => {
        const fileMeta = ctx.files.get(s.fileName);
        if (fileMeta) {
          fileMeta.recompileOnChange = true;
          fileMeta.jsFilePath = jsFilePath;
          fileMeta.jsText = jsText;
        }
      });

      if (jsText && jsText.trim().length) {
        outputs.set(jsFilePath, jsText);
      }

      writeByteOrderMark; onError;
    }
  };

  const program = ts.createProgram(tsFilePaths, tsCompilerOptions, tsHost);

  if (program.getSyntacticDiagnostics().length > 0) {
    return Promise.reject(program.getSyntacticDiagnostics());
  }

  const result = program.emit(undefined, tsHost.writeFile, undefined, false, {
    before: [
      componentClass(ctx),
      removeImports(ctx)
    ]
  });

  if (result.diagnostics.length > 0) {
    return Promise.reject(result.diagnostics);
  }

  return writeFiles(config.packages, outputs);
}


function createTsCompilerConfigs(config: CompilerConfig) {
  const tsCompilerOptions: ts.CompilerOptions = Object.assign({}, (<any>config.compilerOptions));

  tsCompilerOptions.noImplicitUseStrict = true;
  tsCompilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
  tsCompilerOptions.module = ts.ModuleKind.ES2015;
  tsCompilerOptions.target = getTsScriptTarget(config.compilerOptions.target);
  tsCompilerOptions.isolatedModules = true;
  tsCompilerOptions.allowSyntheticDefaultImports = true;
  tsCompilerOptions.allowJs = true;

  tsCompilerOptions.lib = tsCompilerOptions.lib || [];
  if (!tsCompilerOptions.lib.indexOf('lib.dom.d.ts')) {
    tsCompilerOptions.lib.push('lib.dom.d.ts');
  }
  if (!tsCompilerOptions.lib.indexOf('lib.es2015.d.ts')) {
    tsCompilerOptions.lib.push('lib.es2015.d.ts');
  }
  if (!tsCompilerOptions.lib.indexOf('lib.es5.d.ts')) {
    tsCompilerOptions.lib.push('lib.es5.d.ts');
  }

  return tsCompilerOptions;
}


function getTsFilePaths(ctx: BuildContext) {
  const filePaths: string[] = [];

  ctx.files.forEach(fileMeta => {
    if (fileMeta.isTsSourceFile && fileMeta.hasCmpClass) {
      filePaths.push(fileMeta.filePath);
    }
  });

  return filePaths;
}


export function getTsScriptTarget(str: 'es5' | 'es2015') {
  if (str === 'es2015') {
    return ts.ScriptTarget.ES2015;
  }

  return ts.ScriptTarget.ES5;
}
