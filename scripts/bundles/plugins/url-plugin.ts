import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import { join } from 'path';

export function urlPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'urlPlugin',

    resolveId(id) {
      if (id === 'url') {
        return join(opts.bundleHelpersDir, 'url.js');
      }
      return null;
    },
  };
}
