import rollupReplace from '@rollup/plugin-replace';
import type { Plugin } from 'rollup';

import { BuildOptions, createReplaceData } from '../../utils/options';

/**
 * Creates a rollup plugin to replace strings in files during the bundling process
 * @param opts the options being used during a build
 * @returns the plugin that replaces specific pre-defined strings during the build
 */
export function replacePlugin(opts: BuildOptions): Plugin {
  const replaceData = createReplaceData(opts);
  replaceData[`process.env.NODE_DEBUG`] = false;
  replaceData[`process.binding('natives')`] = '';
  return rollupReplace({ ...replaceData, preventAssignment: true });
}
