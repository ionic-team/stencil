import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Add a getter to a class for a static representation of the watchers
 * registered on the Stencil component.
 *
 * *Note*: this will conditionally mutate the `classMembers` param, adding a
 * new element.
 *
 * @param classMembers a list of class members
 * @param cmp metadata about the stencil component of interest
 */
export declare const addWatchers: (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => void;
