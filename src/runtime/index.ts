import * as d from '../declarations';
import { BUILD } from '@build-conditionals';

export { bootstrapLazy } from './bootstrap-lazy';
export { patchDynamicImport } from './dynamic-import-shim';
export { connectedCallback } from './connected-callback';
export { createEvent } from './event-emitter';
export { disconnectedCallback } from './disconnected-callback';
export { getAssetPath } from './get-asset-path';
export { getConnect } from './connect';
export { getDocument, getElement, getWindow } from './element';
export { getValue, setValue } from './set-value';
export { h, Host } from './vdom/h';
export { insertVdomAnnotations } from './vdom/vdom-annotations';
export { parsePropertyValue } from './parse-property-value';
export { proxyNative, proxyComponent } from './proxy-component';
export { renderVdom } from './vdom/vdom-render';
export { setMode, getMode } from './mode';

export const Build: d.UserBuildConditionals = {
  isDev: BUILD.isDev
};
