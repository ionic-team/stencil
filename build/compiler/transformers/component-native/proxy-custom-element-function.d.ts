import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Proxy custom elements for the `dist-custom-elements` output target. This function searches for a Stencil component's
 * class initializer (found on the right-hand side of the '=' operator):
 *
 * ```ts
 * const MyComponent = class extends HTMLElement { // Implementation omitted }
 * ```
 *
 * and wraps the initializer into a `proxyCustomElement` call:
 *
 * ```ts
 * const MyComponent = proxyCustomElement(class extends HTMLElement { // Implementation omitted }, componentMetadata);
 * ```
 *
 * This is to work around an issue where tree-shaking does not work for webpack users, whose details are captured in full
 * in [this issue on the webpack GitHub repo](https://github.com/webpack/webpack/issues/14963).
 *
 * @param compilerCtx current compiler context
 * @param transformOpts transpilation options for the current build
 * @returns a TypeScript AST transformer factory function that performs the above described transformation
 */
export declare const proxyCustomElement: (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions) => ts.TransformerFactory<ts.SourceFile>;
