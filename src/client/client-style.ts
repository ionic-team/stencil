import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


export const styles: d.StyleMap = BUILD.style ? new Map() : undefined;
