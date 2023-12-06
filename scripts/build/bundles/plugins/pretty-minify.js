"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyMinifyPlugin = void 0;
function prettyMinifyPlugin(opts, preamble) {
    if (opts.isProd) {
        return {
            name: 'prettyMinifyPlugin',
            async generateBundle(_, bundles) {
                const { minify } = await import('terser');
                await Promise.all(Object.keys(bundles).map(async (fileName) => {
                    const b = bundles[fileName];
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
                }));
            },
        };
    }
}
exports.prettyMinifyPlugin = prettyMinifyPlugin;
