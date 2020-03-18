import fs from 'fs-extra';
import { BuildOptions } from '../../utils/options';
import { join } from 'path';
import { Plugin } from 'rollup';

export function sizzlePlugin(opts: BuildOptions): Plugin {
  return {
    name: 'sizzlePlugin',
    resolveId(id) {
      if (id === 'sizzle') {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id !== 'sizzle') {
        return null;
      }
      const f = opts.isProd ? 'sizzle.min.js' : 'sizzle.js';
      const sizzlePath = join(opts.nodeModulesDir, 'sizzle', 'dist', f);
      const sizzleContent = await fs.readFile(sizzlePath, 'utf8');
      return getSizzleBundle(sizzleContent);
    },
  };
}

function getSizzleBundle(content: string) {
  return `export default (function() {

const window = {
  document: {
    createElement() {
      return {};
    },
    nodeType: 9,
    documentElement: {
      nodeType: 1,
      nodeName: 'HTML'
    }
  }
};

const module = { exports: {} };

${content}

return module.exports;
})();
`;
}
