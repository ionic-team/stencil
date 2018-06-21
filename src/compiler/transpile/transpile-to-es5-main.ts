import * as d from '../../declarations';


export async function transpileToEs5Main(config: d.Config, compilerCtx: d.CompilerCtx, input: string) {
  const cacheKey = compilerCtx.cache.createKey('transpileToEs5', '__BUILDID:TRANSPILE__', input);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    const results: d.TranspileResults = {
      code: cachedContent,
      diagnostics: []
    };
    return results;
  }

  const results = await config.sys.transpileToEs5(config.cwd, input);

  if (results.diagnostics.length === 0) {
    await compilerCtx.cache.put(cacheKey, results.code);
  }

  return results;
}
