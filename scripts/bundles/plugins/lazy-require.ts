import fs from 'fs-extra';
import path from 'path';
import type { OutputChunk, Plugin } from 'rollup';

import type { BuildOptions } from '../../utils/options';

export function lazyRequirePlugin(opts: BuildOptions, moduleIds: string[], resolveToPath: string): Plugin {
  return {
    name: 'lazyRequirePlugin',
    resolveId(importee) {
      if (moduleIds.includes(importee)) {
        return {
          id: resolveToPath,
          external: true,
        };
      }
      return null;
    },
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        const b = bundle[fileName] as OutputChunk;
        if (b.code) {
          b.code = b.code.replace(`require('${resolveToPath}')`, `_lazyRequire('${resolveToPath}')`);

          if (!b.code.includes('function _lazyRequire(')) {
            b.code = b.code.replace(`'use strict';`, `'use strict';\n\n${getLazyRequireFn(opts)}`);
          }
        }
      });
    },
  };
}

function getLazyRequireFn(opts: BuildOptions) {
  return fs.readFileSync(path.join(opts.bundleHelpersDir, 'lazy-require.js'), 'utf8').trim();
}
