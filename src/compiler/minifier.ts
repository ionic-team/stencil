import * as d from '../declarations';
import { generatePreamble } from './util';


/**
 * Interal minifier, not exposed publicly.
 */
export async function minifyJs(config: d.Config, compilerCtx: d.CompilerCtx, jsText: string, sourceTarget: d.SourceTarget, preamble: boolean, buildTimestamp?: string) {
  const opts: any = { output: {}, compress: {}, mangle: true };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.output.beautify = false;

  } else {
    opts.ecma = 6;
    opts.output.ecma = 6;
    opts.compress.ecma = 6;
    opts.toplevel = true;
    opts.compress.arrows = true;
    opts.output.beautify = false;
  }

  if (config.logLevel === 'debug') {
    opts.mangle = {};
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.bracketize = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
    opts.output.preserve_line = true;
  } else {
    opts.compress.pure_funcs = ['assert', 'console.debug'];
  }

  opts.compress.passes = 2;

  if (preamble) {
    opts.output.preamble = generatePreamble(config, { suffix: buildTimestamp });
  }

  let cacheKey: string;

  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyJs', '__BUILDID:MINIFYJS__', opts, jsText);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: []
      };
    }
  }

  const r = await config.sys.minifyJs(jsText, opts);

  if (compilerCtx) {
    if (r && r.diagnostics.length === 0 && typeof r.output === 'string') {
      await compilerCtx.cache.put(cacheKey, r.output);
    }
  }

  return r;
}
