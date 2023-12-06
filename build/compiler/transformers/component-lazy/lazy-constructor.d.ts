import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Update the constructor for a Stencil component's class in order to prepare
 * it for lazy-build duty (i.e. to take over a bootstrapped component)
 *
 * @param classMembers an out param of class members for the component
 * @param classNode the class declaration of interest
 * @param moduleFile information about the component's home module
 * @param cmp compiler metadata about the component
 */
export declare const updateLazyComponentConstructor: (classMembers: ts.ClassElement[], classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => void;
