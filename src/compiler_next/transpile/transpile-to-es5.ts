import * as d from '../../declarations';
import { loadTypeScriptDiagnostics, hasError } from '@utils';
import { loadTypescript } from '../sys/typescript/typescript-load';


export const transpileToEs5 = async (input: string, inlineHelpers: boolean) => {
  const diagnostics: d.Diagnostic[] = [];
  const ts = await loadTypescript(diagnostics, null);

  const results: d.TranspileResults = {
    sourceFilePath: null,
    code: input,
    map: null,
    diagnostics: diagnostics,
    moduleFile: null,
    build: {}
  };
  if (hasError(diagnostics)) {
    return results;
  }

  const transpileOpts = {
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
  results.diagnostics.push(
    ...loadTypeScriptDiagnostics(tsResults.diagnostics)
  );
  if (!hasError(results.diagnostics)) {
    results.code = fixHelpers(tsResults.outputText);
  }

  return results;
};

// TODO:
// remove once fixed: https://github.com/microsoft/TypeScript/issues/35108
const fixHelpers = (code: string) => {
  return code.replace(/\b__(extends|assign|rest|decorate|param|metadata|awaiter|generator|exportStar|values|read|spread|spreadArrays|await|asyncGenerator|asyncDelegator|asyncValues|makeTemplateObject|importStar|importDefault|)_\d\(/g, '__$1(');
};
