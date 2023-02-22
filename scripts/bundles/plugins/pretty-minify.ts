import type { OutputChunk, Plugin } from 'rollup';

import type { BuildOptions } from '../../utils/options';

export function prettyMinifyPlugin(opts: BuildOptions, preamble?: string): Plugin {
  if (opts.isProd) {
    return {
      name: 'prettyMinifyPlugin',
      async generateBundle(_, bundles) {
        const { minify } = await import('terser');
        await Promise.all(
          Object.keys(bundles).map(async (fileName) => {
            const b = bundles[fileName] as OutputChunk;
            if (typeof b.code === 'string') {
              const minifyResults = await minify(b.code, {
                compress: {
                  hoist_vars: true,
                  hoist_funs: true,
                  ecma: 2018,
                  keep_fnames: true,
                  keep_classnames: true,
                  module: true,
                  arrows: true,
                  passes: 2,
                },
                format: { ecma: 2018, indent_level: 1, beautify: true, comments: false, preamble },
                sourceMap: false,
              });
              b.code = minifyResults.code;
            }
          })
        );
      },
    };
  }
}
