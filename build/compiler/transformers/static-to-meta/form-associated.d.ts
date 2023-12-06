import ts from 'typescript';
/**
 * Parse whether a transformed Stencil component is form-associated
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns whether or not the given component is form-associated
 */
export declare const parseFormAssociated: (staticMembers: ts.ClassElement[]) => boolean;
