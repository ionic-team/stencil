import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Create a {@link ts.TransformerFactory} which will handle converting any
 * decorators on Stencil component classes (i.e. classes decorated with
 * `@Component`) to static representations of the options, names, etc.
 * associated with the various decorators that Stencil supports like `@Prop`,
 * `@State`, etc.
 *
 * This `TransformerFactory` returned by this function will handle all classes
 * declared within a module.
 *
 * @param config a user-supplied configuration for Stencil
 * @param diagnostics for surfacing errors and warnings
 * @param typeChecker a TypeScript typechecker instance
 * @param program a {@link ts.Program} object
 * @returns a TypeScript transformer factory which can be passed to
 * TypeScript to transform source code during the compilation process
 */
export declare const convertDecoratorsToStatic: (config: d.ValidatedConfig, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, program: ts.Program) => ts.TransformerFactory<ts.SourceFile>;
/**
 * Generate a list of decorators from a syntax tree node that are not in a provided exclude list
 *
 * @param decorators the syntax tree node's decorators should be inspected
 * @param excludeList the names of decorators that should _not_ be included in the returned list
 * @returns a list of decorators on the AST node that are not in the provided list, or `undefined` if:
 * - there are no decorators on the node
 * - the node contains only decorators in the provided list
 */
export declare const filterDecorators: (decorators: ReadonlyArray<ts.Decorator> | undefined, excludeList: ReadonlyArray<string>) => ReadonlyArray<ts.Decorator> | undefined;
