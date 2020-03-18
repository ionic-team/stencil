import path from 'path';
import { Plugin } from 'rollup';

const modules = new Set(['crypto', 'events', 'fs', 'module', 'os', 'path', 'stream', 'typescript', 'url', 'util']);

export function sysModulesPlugin(inputDir: string): Plugin {
  return {
    name: 'sysModulesPlugin',
    resolveId(importee) {
      if (modules.has(importee)) {
        return path.join(inputDir, 'sys', 'modules', `${importee}.js`);
      }
      return null;
    },
  };
}
