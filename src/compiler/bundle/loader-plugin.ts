import type { Plugin } from 'rollup';

export const loaderPlugin = (entries: { [id: string]: string } = {}): Plugin => {
  return {
    name: 'stencilLoaderPlugin',
    resolveId(id: string) {
      if (id in entries) {
        return {
          id,
        };
      }
      return null;
    },

    load(id: string) {
      if (id in entries) {
        return entries[id];
      }
      return null;
    },
  };
};
