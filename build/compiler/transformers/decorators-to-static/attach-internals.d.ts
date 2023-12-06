import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Convert the attach internals decorator to static, saving the name of the
 * decorated property so an `ElementInternals` object can be bound to it later
 * on.
 *
 * The `@AttachInternals` decorator is used to indicate a field on a class
 * where the return value of the `HTMLElement.attachInternals` method should be
 * bound. This then allows component authors to use that interface to make their
 * Stencil components rich participants in whatever `HTMLFormElement` instances
 * they find themselves inside of in the future.
 *
 * **Note**: this function will mutate the `newMembers` parameter in order to
 * add new members to the class.
 *
 * @param diagnostics for reporting errors and warnings
 * @param decoratedMembers the decorated members found on the class
 * @param newMembers an out param for new class members
 * @param typeChecker a TypeScript typechecker, needed for resolving the prop
 * declaration name
 */
export declare const attachInternalsDecoratorsToStatic: (diagnostics: d.Diagnostic[], decoratedMembers: ts.ClassElement[], newMembers: ts.ClassElement[], typeChecker: ts.TypeChecker) => void;
