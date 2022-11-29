import { join } from 'path';

import * as build from './build';

const stencilProjectRoot = join(__dirname, '..', '..');
const args = process.argv.slice(2);
build.run(stencilProjectRoot, args);
