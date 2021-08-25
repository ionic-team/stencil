import type { Plugin } from 'rollup';

/**
 * Prepares the loader, which helps with Webpack compilation when a consumer library is imported with webpack.
 *
 * @param entries A key/value library with an id of the name in the cache mapping to the filepath for each of the components that will be loaded.
 * @returns
 */
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
