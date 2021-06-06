import rollupReplace from '@rollup/plugin-replace';
import { BuildOptions, createReplaceData } from '../../utils/options';

export function replacePlugin(opts: BuildOptions) {
  const replaceData = createReplaceData(opts);
  replaceData[`process.env.NODE_DEBUG`] = false;
  replaceData[`process.binding('natives')`] = '';
  return rollupReplace(replaceData);
}
