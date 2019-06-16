import { rollup } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';


export const BrowserRollup = {
  rollup,
  plugins: {
    commonjs,
    nodeResolve,
    replace,
  }
};
