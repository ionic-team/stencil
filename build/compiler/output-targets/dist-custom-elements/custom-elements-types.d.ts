import type * as d from '../../../declarations';
/**
 * Entrypoint for generating types for one or more `dist-custom-elements` output targets defined in a Stencil project's
 * configuration
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param typesDir the path to the directory where type declarations are saved
 */
export declare const generateCustomElementsTypes: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typesDir: string) => Promise<void>;
