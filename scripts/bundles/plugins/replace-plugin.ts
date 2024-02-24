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

/**
 * We need to manually find-and-replace a bit of code in
 * `client-load-module.ts` which has to be present in order to prevent Esbuild
 * from analyzing / transforming the input by ensuring it does not start with
 * `"./"`. However some _other_ bundlers will _not_ work with such an import if
 * it _lacks_ a leading `"./"`, so we thus we have to do a little dance where
 * we manually replace it here after it's been run through Rollup.
 *
 * @returns a rollup string replacement plugin
 */
export function loadModuleReplacePlugin(): Plugin {
  return rollupReplace({
    // this ensures that the strings are replaced even if they are not
    // surrounded by whitespace
    // see https://github.com/rollup/plugins/blob/master/packages/replace/README.md#delimiters
    delimiters: ['', ''],
    '${MODULE_IMPORT_PREFIX}': './',
  });
}
