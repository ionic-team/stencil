import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Update the class declaration node for a Stencil component in order to make
 * it suitable for 'taking over' a bootstrapped lazy build. This involves making
 * edits to the constructor, handling initialization code for various class
 * members, and so on.
 *
 * @param transformOpts transform options
 * @param styleStatements an out param for style-related statements
 * @param classNode the class declaration node
 * @param moduleFile information on the class' home module
 * @param cmp metadata collected during the compilation process
 * @returns the updated class
 */
export declare const updateLazyComponentClass: (transformOpts: d.TransformOptions, styleStatements: ts.Statement[], classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => ts.VariableStatement | ts.ClassDeclaration;
