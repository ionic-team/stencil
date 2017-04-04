import { buildCore } from './build-core';
import * as path from 'path';


console.log('Build Angular');


const transpiledSrcDir = path.join(__dirname, '../transpiled-angular');
const destDir = path.join(__dirname, '../ionic-angular');


buildCore(transpiledSrcDir, destDir);
