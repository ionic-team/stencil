

export function loaderPlugin(entries: {[id: string]: string}) {
  return {
    name: 'stencilLoaderPlugin',
    resolveId(id: string) {
      if (id in entries) {
        return id;
      }
      return null;
    },

    load(id: string) {
      if (id in entries) {
        return entries[id];
      }
      return null;
    }
  };
}
