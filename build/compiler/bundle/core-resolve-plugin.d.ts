import type { Plugin } from 'rollup';
import type * as d from '../../declarations';
export declare const coreResolvePlugin: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, platform: 'client' | 'hydrate' | 'worker', externalRuntime: boolean) => Plugin;
export declare const getStencilInternalModule: (config: d.ValidatedConfig, compilerExe: string, internalModule: string) => string;
export declare const getHydratedFlagHead: (h: d.HydratedFlag) => string;
