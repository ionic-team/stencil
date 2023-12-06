import ts from 'typescript';
/**
 * Parse the name of the form internals prop from a transformed Stencil
 * component if present
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns the parsed value, if present, else null
 */
export declare const parseAttachInternals: (staticMembers: ts.ClassElement[]) => string | null;
