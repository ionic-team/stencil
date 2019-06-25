import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';


export async function transpileToEs5Main(config: d.Config, compilerCtx: d.CompilerCtx, input: string, inlineHelpers = true) {
  if (config.sys.transpileToEs5 == null) {
    return null;
  }

  const cacheKey = await compilerCtx.cache.createKey('transpileToEs5', COMPILER_BUILD.transpiler, input);

  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    const results: d.TranspileResults = {
      code: cachedContent,
      diagnostics: [],
      build: {},
      map: null,
      sourceFilePath: null,
      moduleFile: null
    };
    return results;
  }

  const results = await config.sys.transpileToEs5(config.cwd, input, inlineHelpers);

  if (results.diagnostics.length === 0) {
    await compilerCtx.cache.put(cacheKey, results.code);
  }
  return results;
}
