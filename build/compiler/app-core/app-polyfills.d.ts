import type * as d from '../../declarations';
export declare const getClientPolyfill: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, polyfillFile: string) => Promise<string>;
export declare const getAppBrowserCorePolyfills: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => Promise<string>;
