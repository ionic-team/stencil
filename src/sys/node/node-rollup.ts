import { rollup } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import path from 'path';


export const NodeRollup = {
  rollup,
  plugins: {
    commonjs,
    nodeResolve,
    emptyJsResolver: () => {
      return {
        load(id: string) {
          if (id.endsWith('empty.js') && id.endsWith(path.join(__dirname, '../src/empty.js'))) {
            return 'export default {};';
          }
          return null;
        }
      };
    }
  }
};
