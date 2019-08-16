import * as d from '../declarations';
import { win } from './client-window';
import { BUILD } from '@build-conditionals';

export const styles: d.StyleMap = /*@__PURE__*/ new Map();
export const cssVarShim: d.CssVarSim = BUILD.cssVarShim ? /*@__PURE__*/ (() => (win as any).__stencil_cssshim)() : false;
