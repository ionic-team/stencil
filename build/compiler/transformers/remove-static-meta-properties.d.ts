import ts from 'typescript';
/**
 * Creates a new collection of class members that belong to the provided class node and that do not exist in
 * {@link STATIC_GETTERS_TO_REMOVE}
 * @param classNode the class node in the syntax tree to inspect
 * @returns a new collection of class members belonging to the provided class node, less those found in
 * {@link STATIC_GETTERS_TO_REMOVE}
 */
export declare const removeStaticMetaProperties: (classNode: ts.ClassDeclaration) => ts.ClassElement[];
