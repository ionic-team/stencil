import { Plugin } from 'rollup';

export function gracefulFsPlugin(): Plugin {
  return {
    name: 'gracefulFsPlugin',
    resolveId(id) {
      if (id === 'graceful-fs') {
        return {
          id: '../sys/node/graceful-fs.js',
          external: true,
        };
      }
      return null;
    },
  };
}
