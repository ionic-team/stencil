import * as dec from '../declarations';
import { createPlatformMain } from './platform-main';


declare const w: Window;
declare const d: Document;
declare const n: string;
declare const x: dec.CoreContext;
declare const r: string;
declare const h: string;
declare const c: dec.ComponentHostData[];

export { h } from '../renderer/vdom/h';

// esm build which uses es module imports and dynamic imports
createPlatformMain(n, x, w, d, r, h, c);
