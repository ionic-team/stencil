import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Return a transformer factory which transforms a Stencil component to make it
 * suitable for 'taking over' a bootstrapped component in the lazy build.
 *
 * Note that this is an 'output target' level transformer, i.e. it is
 * designed to be run on a Stencil component which has already undergone
 * initial transformation (which handles things like converting decorators to
 * static and so on).
 *
 * @param compilerCtx a Stencil compiler context object
 * @param transformOpts transform options
 * @returns a {@link ts.TransformerFactory} for carrying out necessary transformations
 */
export declare const lazyComponentTransform: (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions) => ts.TransformerFactory<ts.SourceFile>;
