import * as d from '../declarations';
import { generatePreamble } from './util';


/**
 * Interal minifier, not exposed publicly.
 */
export async function minifyJs(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], jsText: string, sourceTarget: d.SourceTarget, preamble: boolean, buildTimestamp?: string): Promise<string> {
  const opts: any = {
    output: {beautify: false},
    compress: {},
    sourceMap: false,
    mangle: true
  };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.compress.pure_getters = true;

  } else {
    opts.ecma = 7;
    opts.toplevel = true;
    opts.module = true;
    opts.output.ecma = 7;
    opts.compress.ecma = 7;
    opts.compress.arrows = true;
    opts.compress.module = true;
    opts.compress.pure_getters = true;
  }

  if (config.logLevel === 'debug') {
    opts.mangle = {};
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
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
      return cachedContent;
    }
  }

  const r = await config.sys.minifyJs(jsText, opts);
  if (r && r.diagnostics.length === 0 && typeof r.output === 'string') {
    r.output = auxMinify(r.output);
    if (compilerCtx) {
      await compilerCtx.cache.put(cacheKey, r.output);
    }
  }

  if (r.diagnostics.length > 0) {
    diagnostics.push(...r.diagnostics);
    return jsText;
  } else {
    return r.output;
  }
}

function auxMinify(jsText: string) {
  return jsText.replace(/^window;/, '');
}
