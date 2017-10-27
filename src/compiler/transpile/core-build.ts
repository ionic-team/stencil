import { CoreBuildConditionals, Diagnostic, TranspileResults } from '../../util/interfaces';
import { coreBuildConditionalsTransform } from './transformers/core-build-conditionals';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import * as ts from 'typescript';


export function transpileCoreBuild(coreBuild: CoreBuildConditionals, input: string) {
  const diagnostics: Diagnostic[] = [];
  const results: TranspileResults = {
    code: null,
    diagnostics: null
  };

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: getCompilerOptions(coreBuild),
    transformers: {
      before: [
        coreBuildConditionalsTransform(coreBuild)
      ]
    }
  };

  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics('', diagnostics, tsResults.diagnostics);

  if (diagnostics.length) {
    results.diagnostics = diagnostics;
    results.code = input;
    return results;
  }

  results.code = tsResults.outputText;

  return results;
}


function getCompilerOptions(coreBuild: CoreBuildConditionals) {
  const opts: ts.CompilerOptions = {
    allowJs: true
  };

  if (coreBuild._build_es2015) {
    opts.target = ts.ScriptTarget.ES2015;

  } else if (coreBuild._build_es5) {
    opts.target = ts.ScriptTarget.ES5;
  }

  return opts;
}
