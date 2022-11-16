import fs from 'fs-extra';
import { join } from 'path';
import type { Plugin } from 'rollup';

import type { BuildOptions } from '../../utils/options';

/**
 * Bundles sizzle, a CSS selector engine, into the Stencil compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that inlines sizzle
 */
export function sizzlePlugin(opts: BuildOptions): Plugin {
  return {
    name: 'sizzlePlugin',
    /**
     * A rollup build hook for resolving sizzle [Source](https://rollupjs.org/guide/en/#resolveid)
     * @param id the importee exactly as it is written in the import statement
     * @returns a string that resolves an import to some id
     */
    resolveId(id: string): string | null {
      if (id === 'sizzle') {
        return id;
      }
      return null;
    },
    /**
     * A rollup build hook for loading sizzle. [Source](https://rollupjs.org/guide/en/#load)
     * @param id the path of the module to load
     * @returns sizzle, pre-bundled
     */
    async load(id: string): Promise<string> {
      if (id !== 'sizzle') {
        return null;
      }
      const f = opts.isProd ? 'sizzle.min.js' : 'sizzle.js';
      const sizzlePath = join(opts.nodeModulesDir, 'sizzle', 'dist', f);
      const sizzleContent = await fs.readFile(sizzlePath, 'utf8');
      return getSizzleBundle(opts, sizzleContent);
    },
  };
}

/**
 * Creates a sizzle bundle to inline
 * @param opts the options being used during a build of the Stencil compiler
 * @param content the sizzle source contents
 * @returns a modified version of sizzle, wrapped in an immediately invoked function expression (IIFE)
 */
function getSizzleBundle(opts: BuildOptions, content: string): string {
  return `// Sizzle ${opts.sizzleVersion}
export default (function() {
const window = {
  document: {
    createElement() {
      return {};
    },
    nodeType: 9,
    documentElement: {
      nodeType: 1,
      nodeName: 'HTML'
    }
  }
};
const module = { exports: {} };

${content}

return module.exports;
})();
`;
}
