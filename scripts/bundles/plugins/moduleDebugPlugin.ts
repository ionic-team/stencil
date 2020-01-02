import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import path from 'path';


export function moduleDebugPlugin(opts: BuildOptions): Plugin {

  return {
    name: 'moduleDebugPlugin',
    transform(code, id) {
      const debugPath = path.posix.relative(opts.transpiledDir, id);
      const comment = `// MODULE: ${debugPath}\n`;
      return comment + code;
    }
  }
}
