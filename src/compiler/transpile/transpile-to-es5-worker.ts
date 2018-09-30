import * as d from '../../declarations';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import * as path from 'path';
import ts from 'typescript';


export async function transpileToEs5Worker(cwd: string, input: string, inlineHelpers: boolean) {
  const config: d.Config = {
    cwd: cwd,
    sys: {
      path: path
    } as any
  };

  const results: d.TranspileResults = {
    code: input,
    diagnostics: []
  };

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: {
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

  loadTypeScriptDiagnostics(config, results.diagnostics, tsResults.diagnostics);

  if (results.diagnostics.length === 0) {
    results.code = tsResults.outputText;
  }

  return results;
}
