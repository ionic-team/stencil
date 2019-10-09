import replace from 'rollup-plugin-replace';
import { BuildOptions } from '../../utils/options';


export function replacePlugin(opts: BuildOptions) {
  return replace(opts.replaceData)
}
