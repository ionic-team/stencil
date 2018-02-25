import * as d from '../../declarations';


export async function minifyStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, styleText: string) {
  const cacheKey = compilerCtx.cache.createKey('minifyStyle', styleText);
  const cachedContent = await compilerCtx.cache.get(cacheKey);

  if (cachedContent != null) {
    return cachedContent;
  }

  const minifyResults = config.sys.minifyCss(styleText);
  minifyResults.diagnostics.forEach(d => {
    buildCtx.diagnostics.push(d);
  });

  if (typeof minifyResults.output === 'string') {
    await compilerCtx.cache.put(cacheKey, minifyResults.output);
    return minifyResults.output;
  }

  return styleText;
}
