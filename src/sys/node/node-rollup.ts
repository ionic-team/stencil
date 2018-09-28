import { rollup } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';


export const NodeRollup = {
  rollup,
  plugins: {
    commonjs,
    nodeResolve
  }
};
