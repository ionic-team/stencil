import ts from 'typescript';
/**
 * Convert class fields decorated with `@State` to static getters
 *
 * This function takes a list of decorated properties pulled off of a class
 * declaration AST Node and builds up equivalent static getter AST nodes
 * with which they can be replaced.
 *
 * @param decoratedProps TypeScript AST nodes representing class members
 * @param newMembers an out param containing new class members
 * @param typeChecker a reference to the TypeScript type checker
 */
export declare const stateDecoratorsToStatic: (decoratedProps: ts.ClassElement[], newMembers: ts.ClassElement[], typeChecker: ts.TypeChecker) => void;
