import ts from 'typescript';
import type { StencilDecorator } from './decorators-constants';
export declare const getDecoratorParameters: GetDecoratorParameters;
/**
 * Returns a function that checks if a decorator:
 * - is a call expression. these are decorators that are immediately followed by open/close parenthesis with optional
 *   arg(s), e.g. `@Prop()`
 * - the name of the decorator matches the provided `propName`
 *
 * @param propName the name of the decorator to match against
 * @returns true if the conditions above are both true, false otherwise
 */
export declare const isDecoratorNamed: (propName: StencilDecorator) => (dec: ts.Decorator) => boolean;
export interface GetDecoratorParameters {
    <T>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T];
    <T, T1>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1];
    <T, T1, T2>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1, T2];
}
