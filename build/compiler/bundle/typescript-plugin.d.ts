import type { Plugin } from 'rollup';
import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
/**
 * Rollup plugin that aids in resolving the TypeScript files and performing the transpilation step.
 * @param compilerCtx the current compiler context
 * @param bundleOpts Rollup bundling options to apply during TypeScript compilation
 * @param config the Stencil configuration for the project
 * @returns the rollup plugin for handling TypeScript files.
 */
export declare const typescriptPlugin: (compilerCtx: d.CompilerCtx, bundleOpts: BundleOptions, config: d.ValidatedConfig) => Plugin;
export declare const resolveIdWithTypeScript: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => Plugin;
