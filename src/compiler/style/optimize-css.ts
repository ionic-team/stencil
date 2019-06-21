import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { hasError, normalizePath } from '@utils';


export async function optimizeCss(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], styleText: string, filePath: string, legacyBuild: boolean) {
  if (typeof styleText !== 'string' || !styleText.length) {
    //  don't bother with invalid data
    return styleText;
  }

  if ((config.autoprefixCss === false || config.autoprefixCss === null) && !config.minifyCss) {
    // don't wanna autoprefix or minify, so just skip this
    return styleText;
  }

  if (typeof filePath === 'string') {
    filePath = normalizePath(filePath);
  }

  const opts: d.OptimizeCssInput = {
    css: styleText,
    filePath: filePath,
    autoprefixer: config.autoprefixCss,
    minify: config.minifyCss,
    legecyBuild: legacyBuild
  };

  const cacheKey = await compilerCtx.cache.createKey('optimizeCss', COMPILER_BUILD.optimizeCss, opts);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    // let's use the cached data we already figured out
    return cachedContent;
  }

  const minifyResults = await config.sys.optimizeCss(opts);
  minifyResults.diagnostics.forEach(d => {
    // collect up any diagnostics from minifying
    diagnostics.push(d);
  });

  if (typeof minifyResults.css === 'string' && !hasError(diagnostics)) {
    // cool, we got valid minified output

    // only cache if we got a cache key, if not it probably has an @import
    await compilerCtx.cache.put(cacheKey, minifyResults.css);

    return minifyResults.css;
  }

  return styleText;
}
