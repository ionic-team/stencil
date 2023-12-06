import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Update an instance of TypeScript's Intermediate Representation (IR) for a
 * class declaration ({@link ts.ClassDeclaration}) with a static getter for the
 * compiler metadata that we produce as part of the compilation process.
 *
 * @param cmpNode an instance of the TypeScript IR for a class declaration (i.e.
 * a stencil component) to be updated
 * @param cmpMeta the component metadata corresponding to that component
 * @returns the updated typescript class declaration
 */
export declare const addComponentMetaStatic: (cmpNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) => ts.ClassDeclaration;
export declare const getPublicCompilerMeta: (cmpMeta: d.ComponentCompilerMeta) => d.ComponentCompilerMeta;
