import { transpileSync } from '@stencil/core/compiler';
import { isString } from '@utils';
export function transpile(input, opts = {}) {
    opts = {
        ...opts,
        componentExport: null,
        componentMetadata: 'compilerstatic',
        coreImportPath: isString(opts.coreImportPath) ? opts.coreImportPath : '@stencil/core/internal/testing',
        currentDirectory: opts.currentDirectory || process.cwd(),
        module: 'cjs',
        proxy: null,
        sourceMap: 'inline',
        style: null,
        styleImportData: 'queryparams',
        target: 'es2015',
        transformAliasedImportPaths: parseStencilTranspilePaths(process.env.__STENCIL_TRANSPILE_PATHS__),
    };
    try {
        const v = process.versions.node.split('.');
        if (parseInt(v[0], 10) >= 10) {
            // let's go with ES2017 for node 10 and above
            opts.target = 'es2017';
        }
    }
    catch (e) { }
    return transpileSync(input, opts);
}
/**
 * Turn a value which we assert can be 'true' or 'false' to a boolean.
 *
 * @param stencilTranspilePaths a value to 'parse'
 * @returns a boolean
 */
function parseStencilTranspilePaths(stencilTranspilePaths) {
    return stencilTranspilePaths === 'true' ? true : false;
}
//# sourceMappingURL=test-transpile.js.map