import { compileSync } from '@stencil/core/compiler';
import { CompileOptions, CompileResults } from '@stencil/core/internal';
import { isString } from '@utils';


export function transpile(input: string, opts: CompileOptions = {}): CompileResults {
  opts = {
    ...opts,
    componentExport: null,
    componentMetadata: 'compilerstatic',
    coreImportPath: isString(opts.coreImportPath) ? opts.coreImportPath : '@stencil/core/internal/testing',
    currentDirectory: opts.currentDirectory || process.cwd(),
    module: 'cjs', // always use commonjs since we're in a node environment
    proxy: null,
    sourceMap: 'inline',
    style: null,
    target: 'es2015', // default to es2015
  };

  try {
    const v = process.version.replace('v', '').split('.');
    if (parseInt(v[0], 10) >= 10) {
      // let's go with ES2017 for node 10 and above
      opts.target = 'es2017';
    }
  } catch (e) {}

  return compileSync(input, opts);
}
