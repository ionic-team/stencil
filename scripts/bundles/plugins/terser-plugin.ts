import fs from 'fs-extra';
import { join } from 'path';
import { Plugin, rollup } from 'rollup';

import type { BuildOptions } from '../../utils/options';

/**
 * Creates a rollup plugin to embed Terser into the Stencil compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that adds Terser into the generated output
 */
export function terserPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'terserPlugin',
    /**
     * A rollup build hook for resolving Terser. [Source](https://rollupjs.org/guide/en/#resolveid)
     * @param id the importee exactly as it is written in an import statement in the source code
     * @returns an object that resolves an import to a specific id
     */
    resolveId(id: string): string | null {
      if (id === 'terser') {
        return id;
      }
      return null;
    },
    /**
     * A rollup build hook for loading Terser. [Source](https://rollupjs.org/guide/en/#load)
     * @param id the path of the module to load
     * @returns the Terser source
     */
    async load(id: string): Promise<string> | null {
      if (id === 'terser') {
        return await bundleTerser(opts);
      }
      return null;
    },
  };
}

/**
 * Creates a bundle containing Terser
 * @param opts the options being used during a build
 * @returns bundled Terser code
 */
async function bundleTerser(opts: BuildOptions): Promise<string> {
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

  const { minify } = await import('terser');

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
