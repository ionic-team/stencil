import { rollup } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import path from 'path';

export const NodeRollup = {
  rollup,
  plugins: {
    commonjs,
    nodeResolve,
    replace,
    emptyJsResolver: () => {
      const emptyFile = path.resolve(__dirname, '../src/empty.js');
      return {
        resolveId(id: string) {
          if (id === emptyFile) {
            return id;
          }
          return null;
        },
        load(id: string) {
          if (id === emptyFile) {
            return 'export default {};';
          }
          return null;
        }
      };
    }
  }
};
