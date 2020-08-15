import fs from 'fs-extra';
import { join } from 'path';
import type { BuildOptions } from '../../utils/options';
import { rollup, Plugin } from 'rollup';
import { minify } from 'terser';

export function terserPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'terserPlugin',
    resolveId(id) {
      if (id === 'terser') {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id === 'terser') {
        return await bundleTerser(opts);
      }
      return null;
    },
  };
}

async function bundleTerser(opts: BuildOptions) {
  const fileName = `terser-${opts.terserVersion.replace(/\./g, '_')}-bundle-cache${opts.isProd ? '.min' : ''}.js`;
  const cacheFile = join(opts.scriptsBuildDir, fileName);

  try {
    return await fs.readFile(cacheFile, 'utf8');
  } catch (e) {}

  const rollupBuild = await rollup({
    input: join(opts.nodeModulesDir, 'terser', 'main.js'),
    external: ['source-map'],
  });

  const { output } = await rollupBuild.generate({
    format: 'es',
    preferConst: true,
    strict: false,
  });

  let code = output[0].code;

  if (opts.isProd) {
    const minified = await minify(code, {
      ecma: 2018,
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

  code = `// Terser ${opts.terserVersion}\n` + code;

  await fs.writeFile(cacheFile, code);

  return code;
}
