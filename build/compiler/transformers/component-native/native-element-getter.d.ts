import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Add a getter to a Stencil component class which returns the element's
 * instance at runtime.
 *
 * *Note*: this will modify the `classMembers` param by adding a new element.
 *
 * @param classMembers members of the class in question
 * @param cmp metadata about the stencil component of interest
 */
export declare const addNativeElementGetter: (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => void;
