import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * If a Stencil component was declared with an `@Element` ref, transform the
 * class to support this getter.
 *
 * @param classMembers an out param which holds class members for the component
 * @param moduleFile information about the stencil component's home module
 * @param cmp metadata gathered about the Stencil component during compilation
 */
export declare const addLazyElementGetter: (classMembers: ts.ClassElement[], moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => void;
