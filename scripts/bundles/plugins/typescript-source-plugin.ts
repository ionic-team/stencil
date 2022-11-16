import fs from 'fs-extra';
import { join } from 'path';
import type { Plugin } from 'rollup';
import { minify } from 'terser';

import type { BuildOptions } from '../../utils/options';

/**
 * Creates a rollup plugin to embed an optimized version of the TypeScript compiler into the Stencil compiler.
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that adds a modified version of the TypeScript compiler into the generated output
 */
export function typescriptSourcePlugin(opts: BuildOptions): Plugin {
  const tsPath = require.resolve('typescript');
  return {
    name: 'typescriptSourcePlugin',
    /**
     * A rollup build hook for resolving TypeScript relative to this project
     * [Source](https://rollupjs.org/guide/en/#resolveid)
     * @param id the importee exactly as it is written in an import statement in the source code
     * @returns an object that resolves an import to a different id
     */
    resolveId(id: string): string | null {
      if (id === 'typescript') {
        return tsPath;
      }
      return null;
    },
    /**
     * A rollup build hook for loading the TypeScript compiler. [Source](https://rollupjs.org/guide/en/#load)
     * @param id the path of the module to load
     * @returns the TypeScript compiler source
     */
    load(id: string): Promise<string> | null {
      if (id === tsPath) {
        return bundleTypeScriptSource(tsPath, opts);
      }
      return null;
    },
  };
}

/**
 * Bundles the TypeScript compiler in the Stencil output. This function also performs several optimizations and
 * modifications to the TypeScript source.
 * @param tsPath a path to the TypeScript compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the modified TypeScript source
 */
async function bundleTypeScriptSource(tsPath: string, opts: BuildOptions): Promise<string> {
  const fileName = `typescript-${opts.typescriptVersion.replace(/\./g, '_')}-bundle-cache${
    opts.isProd ? '.min' : ''
  }.js`;
  const cacheFile = join(opts.scriptsBuildDir, fileName);

  try {
    // check if we've already cached this bundle
    return await fs.readFile(cacheFile, 'utf8');
  } catch (e) {}

  // get the source typescript.js file to modify
  let code = await fs.readFile(tsPath, 'utf8');

  // remove the default ts.getDefaultLibFilePath because it uses some
  // node apis and we'll be replacing it with our own anyways
  code = removeFromSource(code, `ts.getDefaultLibFilePath = getDefaultLibFilePath;`);

  // remove the CPUProfiler since it uses node apis
  code = removeFromSource(code, `enableCPUProfiler: enableCPUProfiler,`);
  code = removeFromSource(code, `disableCPUProfiler: disableCPUProfiler,`);

  // trim off the last part that sets module.exports and polyfills globalThis since
  // we don't want typescript to add itself to module.exports when in a node env
  const tsEnding = `})(ts || (ts = {}));`;
  if (!code.includes(tsEnding)) {
    throw new Error(`"${tsEnding}" not found`);
  }
  const lastEnding = code.lastIndexOf(tsEnding);
  code = code.slice(0, lastEnding + tsEnding.length);

  // there's a billion unnecessary "var ts;" for namespaces
  // but we'll be using the top level "const ts" instead
  code = code.replace(/var ts;/g, '');

  // minification is crazy better if it doesn't use typescript's
  // namespace closures, like (function(ts) {...})(ts = ts || {});
  code = code.replace(/ \|\| \(ts \= \{\}\)/g, '');

  // make a nice clean default export
  // "process.browser" is used by typescript to know if it should use the node sys or not
  const o: string[] = [];
  o.push(`// TypeScript ${opts.typescriptVersion}`);
  o.push(`import { IS_NODE_ENV } from '@environment';`);
  o.push(`process.browser = !IS_NODE_ENV;`);
  o.push(`const ts = {};`);
  o.push(code);
  o.push(`export default ts;`);
  code = o.join('\n');

  if (opts.isProd) {
    const minified = await minify(code, {
      ecma: 2018,
      module: true,
      compress: {
        ecma: 2018,
        passes: 2,
      },
      format: {
        ecma: 2018,
        comments: false,
      },
    });
    code = minified.code;
  }

  await fs.writeFile(cacheFile, code);

  return code;
}

/**
 * Removes a specific section from the provided source code via commenting the offending code out
 * @param srcCode the source code to modify
 * @param removeCode the code to remove from the source
 * @returns the updated source code
 */
function removeFromSource(srcCode: string, removeCode: string): string {
  if (!srcCode.includes(removeCode)) {
    throw new Error(`"${removeCode}" not found`);
  }
  return srcCode.replace(removeCode, `/* commented out: ${removeCode} */`);
}
