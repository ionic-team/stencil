import { buildCore } from './build-core';
import * as path from 'path';


const transpiledSrcDir = path.join(__dirname, '../transpiled-angular/bindings/angular/src');
const destDir = path.join(__dirname, '../ionic-angular');


buildCore(transpiledSrcDir, destDir);
