import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import path from 'path';

export function moduleDebugPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'moduleDebugPlugin',
    transform(code, id) {
      let debugPath = path.relative(opts.transpiledDir, id);
      debugPath = debugPath.replace(/\\/g, '/');
      const comment = `// MODULE: ${debugPath}\n`;
      return comment + code;
    },
  };
}
