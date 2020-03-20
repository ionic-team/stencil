import rollupReplace from '@rollup/plugin-replace';
import { BuildOptions, createReplaceData } from '../../utils/options';

export function replacePlugin(opts: BuildOptions) {
  const replaceData = createReplaceData(opts);
  return rollupReplace(replaceData);
}
