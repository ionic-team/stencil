import * as d from '@declarations';
import { loadTypeScriptDiagnostics } from '@utils';
import path from 'path';
import ts from 'typescript';


export async function transpileToEs5Worker(cwd: string, input: string, inlineHelpers: boolean) {
  const config: d.Config = {
    cwd: cwd
  };

  const results: d.TranspileResults = {
    sourceFilePath: null,
    code: input,
    map: null,
    diagnostics: [],
    moduleFile: null,
    build: {}
  };

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: {
      sourceMap: false,
      allowJs: true,
      declaration: false,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
      isolatedModules: true,
      skipLibCheck: true,
      noEmitHelpers: !inlineHelpers,
      importHelpers: !inlineHelpers
    }
  };

  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics(results.diagnostics, tsResults.diagnostics);

  results.diagnostics.forEach(diagnostic => {
    if (diagnostic.absFilePath) {
      diagnostic.relFilePath = path.relative(config.cwd, diagnostic.absFilePath);
      if (!diagnostic.relFilePath.includes('/')) {
        diagnostic.relFilePath = './' + diagnostic.relFilePath;
      }
    }
  });

  if (results.diagnostics.length === 0) {
    results.code = tsResults.outputText;
  }

  return results;
}
