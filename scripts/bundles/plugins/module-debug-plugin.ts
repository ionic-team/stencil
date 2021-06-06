import type { Plugin } from 'rollup';
import type { BuildOptions } from '../../utils/options';
import path from 'path';

export function moduleDebugPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'moduleDebugPlugin',
    transform(code, id) {
      let debugPath = path.relative(opts.buildDir, id);
      debugPath = debugPath.replace(/\\/g, '/');
      const comment = `// MODULE: ${debugPath}\n`;
      return comment + code;
    },
  };
}
