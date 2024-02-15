import path from 'node:path';
import util from 'node:util';

import { createBuild } from './build.js';
import { getOptions } from './utils/options.js';

const options = {
  'config-prod': {
    type: 'boolean',
  },
  'config-ci': {
    type: 'boolean',
  }
} as const

const args = util.parseArgs({
  args: process.argv.slice(2),
  options
});

const opts = getOptions(path.resolve(__dirname, '..'), {
  isProd: args['config-prod'],
  isCI: args['config-ci'],
});

createBuild(opts).then(
  () => console.log('✅ Build complete'),
  (err) => console.log(`❌ Build failed: ${err}`));
