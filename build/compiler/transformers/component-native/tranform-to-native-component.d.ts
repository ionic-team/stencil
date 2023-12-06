import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * A function that returns a transformation factory. The returned factory
 * performs a series of transformations on Stencil components, in order to
 * generate 'native' web components, which is to say standalone custom elements
 * that are defined by classes extending `HTMLElement` with a
 * `connectedCallback` method and so on.
 *
 * Note that this is an 'output target' level transformer, i.e. it is
 * designed to be run on a Stencil component which has already undergone
 * initial transformation (which handles things like converting decorators to
 * static and so on).

 *
 * @param compilerCtx the current compiler context, which acts as the source of truth for the transformations
 * @param transformOpts the transformation configuration to use when performing the transformations
 * @returns a transformer factory, to be run by the TypeScript compiler
 */
export declare const nativeComponentTransform: (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions) => ts.TransformerFactory<ts.SourceFile>;
