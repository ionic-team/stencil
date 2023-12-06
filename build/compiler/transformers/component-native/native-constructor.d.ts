import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Updates a constructor to include:
 * - a `super()` call
 * - function calls to initialize the component
 * - function calls to create custom event emitters
 * If a constructor does not exist, one will be created
 *
 * The constructor will be added to the provided list of {@link ts.ClassElement}s in place
 *
 * @param classMembers the class elements to modify
 * @param moduleFile the Stencil module representation of the component class
 * @param cmp the component metadata generated for the component
 * @param classNode the TypeScript syntax tree node for the class
 */
export declare const updateNativeConstructor: (classMembers: ts.ClassElement[], moduleFile: d.Module, cmp: d.ComponentCompilerMeta, classNode: ts.ClassDeclaration) => void;
