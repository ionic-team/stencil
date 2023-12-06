import type * as d from '../../declarations';
/**
 * Generate metadata that will be used to generate any given documentation-related
 * output target(s)
 *
 * @param config the configuration associated with the current Stencil task run
 * @param compilerCtx the current compiler context
 * @param buildCtx the build context for the current Stencil task run
 * @returns the generated metadata
 */
export declare const generateDocData: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<d.JsonDocs>;
export declare const getNameText: (name: string, tags: d.JsonDocsTag[]) => string[][];
