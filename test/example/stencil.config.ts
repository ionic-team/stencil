import { Config } from '../../dist';
import builtins from 'rollup-plugin-node-builtins';

export const config: Config = {

  plugins: [
    builtins()
  ],

  testing: {
    reporters: ['default', ['jest-junit', { output: 'www/junit.xml' }]]
  }

};