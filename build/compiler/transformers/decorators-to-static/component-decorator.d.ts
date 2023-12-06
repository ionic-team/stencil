import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Perform code generation to create new class members for a Stencil component
 * which will drive the runtime functionality specified by various options
 * passed to the `@Component` decorator.
 *
 * Inputs are validated (@see {@link validateComponent}) before code generation
 * is performed.
 *
 * **Note**: in this function and in functions that it calls the `newMembers`
 * parameter is treated as an out parameter and mutated, with new class members
 * added to it.
 *
 * @param config a user-supplied config
 * @param typeChecker a TypeScript type checker instance
 * @param diagnostics an array of diagnostics for surfacing errors and warnings
 * @param cmpNode a TypeScript class declaration node corresponding to a
 * Stencil component
 * @param newMembers an out param to hold newly generated class members
 * @param componentDecorator the TypeScript decorator node for the `@Component`
 * decorator
 */
export declare const componentDecoratorToStatic: (config: d.ValidatedConfig, typeChecker: ts.TypeChecker, diagnostics: d.Diagnostic[], cmpNode: ts.ClassDeclaration, newMembers: ts.ClassElement[], componentDecorator: ts.Decorator) => void;
