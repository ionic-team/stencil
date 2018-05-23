import * as d from '../../declarations';


export async function minifyStyle(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], styleText: string, filePath?: string) {
  if (typeof styleText === 'string' && styleText.length > 0) {
    if (config.minifyCss) {
      // production minify css
      return await minifyStyleProd(config, compilerCtx, diagnostics, styleText, filePath);
    }

    // dev minify css: Basically only inline the css, but leave it as is
    return await minifyStyleDev(config, compilerCtx, diagnostics, styleText, filePath);
  }

  return styleText;
}


async function minifyStyleProd(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], styleText: string, filePath: string) {
  const cacheKey = compilerCtx.cache.createKey('minifyStyleProd', styleText, MINIFY_CSS_PROD);
  const cachedContent = await compilerCtx.cache.get(cacheKey);

  if (cachedContent != null) {
    return cachedContent;
  }

  const minifyResults = await config.sys.minifyCss(styleText, filePath, MINIFY_CSS_PROD);
  minifyResults.diagnostics.forEach(d => {
    diagnostics.push(d);
  });

  if (typeof minifyResults.output === 'string') {
    await compilerCtx.cache.put(cacheKey, minifyResults.output);
    return minifyResults.output;
  }

  return styleText;
}


async function minifyStyleDev(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], styleText: string, filePath: string) {
  const cacheKey = compilerCtx.cache.createKey('minifyStyleDev', styleText, MINIFY_CSS_DEV);
  const cachedContent = await compilerCtx.cache.get(cacheKey);

  if (cachedContent != null) {
    return cachedContent;
  }

  const minifyResults = await config.sys.minifyCss(styleText, filePath, MINIFY_CSS_DEV);
  minifyResults.diagnostics.forEach(d => {
    diagnostics.push(d);
  });

  if (typeof minifyResults.output === 'string') {
    await compilerCtx.cache.put(cacheKey, minifyResults.output);
    return minifyResults.output;
  }

  return styleText;
}


const MINIFY_CSS_PROD: any = {
  level: 1
};

const MINIFY_CSS_DEV: any = {
  level: 0,
  format: 'beautify'
};
