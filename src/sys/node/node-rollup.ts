import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export const NodeRollup = {
  rollup,
  plugins: {
    commonjs: commonjs as any,
    nodeResolve: nodeResolve as any,
    replace: replace as any,
    json: json as any,
  }
};
