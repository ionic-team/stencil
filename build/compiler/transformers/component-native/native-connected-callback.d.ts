import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Add or update a `connectedCallback` method for a Stencil component
 *
 * *Note*: This function will mutate either the `classMembers` parameter or
 * one of its members.
 *
 * @param classMembers the members on the component's class
 * @param cmp metadata about the component
 */
export declare const addNativeConnectedCallback: (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => void;
