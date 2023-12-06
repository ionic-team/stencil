import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Update a {@link ts.ClassDeclaration} which corresponds to a Stencil
 * component to ensure that it will work as a standalone custom element in the
 * browser (a 'native' web component).
 *
 * This involves ensuring that the class extends `HTMLElement`, ensuring that
 * it has a constructor, adding a `connectedCallback` method, and a few things
 * that are Stencil-specific implementation details.
 *
 * @param transformOpts options governing how Stencil components should be
 * transformed
 * @param classNode the class to transform
 * @param moduleFile information about the class' home module
 * @param cmp metadata about the stencil component of interest
 * @returns an updated class
 */
export declare const updateNativeComponentClass: (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => ts.ClassDeclaration | ts.VariableStatement;
