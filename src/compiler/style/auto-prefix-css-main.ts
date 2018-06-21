import * as d from '../../declarations';


export async function autoprefixCssMain(config: d.Config, compilerCtx: d.CompilerCtx, input: string, autoprefixConfig: any) {
  const cacheKey = compilerCtx.cache.createKey('autoprefix', '__BUILDID:AUTOPREFIXCSS__', input, autoprefixConfig);
  const cachedContent = await compilerCtx.cache.get(cacheKey);

  if (cachedContent != null) {
    // let's use the cached data we already figured out
    return cachedContent;
  }

  const output = await config.sys.autoprefixCss(input, autoprefixConfig);

  if (typeof output === 'string') {
    await compilerCtx.cache.put(cacheKey, output);
  }

  return output;
}
