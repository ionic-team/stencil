import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sys } from '@sys';


export async function transpileToEs5Main(config: d.Config, compilerCtx: d.CompilerCtx, input: string, inlineHelpers = true) {
  const cacheKey = compilerCtx.cache.createKey('transpileToEs5', COMPILER_BUILD.transpiler, input);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    const results: d.TranspileResults = {
      code: cachedContent,
      diagnostics: []
    };
    return results;
  }

  const results = await sys.transpileToEs5(config.cwd, input, inlineHelpers);

  if (results.diagnostics.length === 0) {
    await compilerCtx.cache.put(cacheKey, results.code);
  }

  return results;
}
