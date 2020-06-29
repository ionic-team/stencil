import { Plugin } from 'rollup';

export function relativePathPlugin(moduleId: string, relativePath: string): Plugin {
  return {
    name: 'relativePathPlugin',
    resolveId(id) {
      if (id === moduleId) {
        return {
          id: relativePath,
          external: true,
        };
      }
      return null;
    },
  };
}
