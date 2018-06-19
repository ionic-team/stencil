import * as d from '../../declarations';
import { buildConditionalsTransform } from './transformers/build-conditionals';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import * as ts from 'typescript';


export async function transpileCoreBuild(config: d.Config, compilerCtx: d.CompilerCtx, coreBuild: d.BuildConditionals, input: string) {
  const results: d.TranspileResults = {
    code: null,
    diagnostics: null
  };

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('transpileCoreBuild', coreBuild, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      results.code = cachedContent;
      results.diagnostics = [];
      return results;
    }
  }

  const diagnostics: d.Diagnostic[] = [];

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: getCompilerOptions(coreBuild),
    transformers: {
      before: [
        buildConditionalsTransform(coreBuild)
      ]
    }
  };

  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics(config, diagnostics, tsResults.diagnostics);

  if (diagnostics.length) {
    results.diagnostics = diagnostics;
    results.code = input;
    return results;
  }

  results.code = tsResults.outputText;

  if (compilerCtx) {
    await compilerCtx.cache.put(cacheKey, results.code);
  }

  return results;
}


export async function transpileToEs5(config: d.Config, compilerCtx: d.CompilerCtx, input: string) {
  const diagnostics: d.Diagnostic[] = [];
  const results: d.TranspileResults = {
    code: null,
    diagnostics: null
  };

  const cacheKey = compilerCtx.cache.createKey('transpileToEs5', input);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    results.code = cachedContent;
    results.diagnostics = [];
    return results;
  }

  const transpileOpts: ts.TranspileOptions = {
    compilerOptions: {
      allowJs: true,
      declaration: false,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.ESNext
    }
  };

  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics(config, diagnostics, tsResults.diagnostics);

  if (diagnostics.length > 0) {
    results.diagnostics = diagnostics;
    results.code = input;
    return results;
  }

  results.code = tsResults.outputText;
  await compilerCtx.cache.put(cacheKey, results.code);

  return results;
}


function getCompilerOptions(coreBuild: d.BuildConditionals) {
  const opts: ts.CompilerOptions = {
    allowJs: true,
    declaration: false
  };

  if (coreBuild.es5) {
    opts.target = ts.ScriptTarget.ES5;

  } else {
    opts.target = ts.ScriptTarget.ES2017;
  }

  opts.module = ts.ModuleKind.ESNext;

  return opts;
}
