import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Parse a collection of class members decorated with `@Prop()`
 *
 * @param diagnostics a collection of compiler diagnostics. During the parsing process, any errors detected must be
 * added to this collection
 * @param decoratedProps a collection of class elements that may or may not my class members decorated with `@Prop`.
 * Only those decorated with `@Prop()` will be parsed.
 * @param typeChecker a reference to the TypeScript type checker
 * @param program a {@link ts.Program} object
 * @param newMembers a collection that parsed `@Prop` annotated class members should be pushed to as a side effect of
 * calling this function
 */
export declare const propDecoratorsToStatic: (diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, program: ts.Program, newMembers: ts.ClassElement[]) => void;
/**
 * Derives a Stencil-permitted prop type from the TypeScript compiler's output. This function may narrow the type of a
 * prop, as the types that can be returned from the TypeScript compiler may be more complex than what Stencil can/should
 * handle for props.
 * @param type the prop type to narrow
 * @returns a valid Stencil prop type
 */
export declare const propTypeFromTSType: (type: ts.Type) => 'any' | 'boolean' | 'number' | 'string' | 'unknown';
