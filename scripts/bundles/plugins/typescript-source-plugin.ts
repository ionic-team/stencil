import fs from 'fs-extra';
import type { Plugin } from 'rollup';
import { join } from 'path';
import type { BuildOptions } from '../../utils/options';
import { minify } from 'terser';

export function typescriptSourcePlugin(opts: BuildOptions): Plugin {
  const tsPath = require.resolve('typescript');
  return {
    name: 'typescriptSourcePlugin',
    resolveId(id) {
      if (id === 'typescript') {
        return tsPath;
      }
      return null;
    },
    load(id) {
      if (id === tsPath) {
        return bundleTypeScriptSource(tsPath, opts);
      }
      return null;
    },
  };
}

async function bundleTypeScriptSource(tsPath: string, opts: BuildOptions) {
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
  // node apis and we'll be replacing it withour own anyways and
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
  code = code.substr(0, lastEnding + tsEnding.length);

  // there's a billion unnecessary "var ts;" for namespaces
  // but we'll be using the top level "const ts" instead
  code = code.replace(/var ts;/g, '');

  // minification is crazy better if it doesn't use typescript's
  // namespace closures, like (function(ts) {...})(ts = ts || {});
  code = code.replace(/ \|\| \(ts \= \{\}\)/g, '');

  // make a nice clean default export
  // "process.browser" is used by typescript to know if it should use the node sys or not
  // this ensures its using our checks. Deno should also use process.browser = true
  // because we don't want deno using the node apis
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

function removeFromSource(srcCode: string, removeCode: string) {
  if (!srcCode.includes(removeCode)) {
    throw new Error(`"${removeCode}" not found`);
  }
  return srcCode.replace(removeCode, `/* commented out: ${removeCode} */`);
}
