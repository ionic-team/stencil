import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Transformation helper for updating how a Stencil component class is declared.
 *
 * Based on the output module type (CommonJS or ESM), the behavior is slightly different:
 * - For CommonJS, the component class is left as is
 * - For ESM, the component class is re-written as a variable statement
 *
 * @param transformOpts the options provided to TypeScript + Rollup for transforming the AST node
 * @param classNode the node in the AST pertaining to the Stencil component class to transform
 * @param heritageClauses a collection of heritage clauses associated with the provided class node
 * @param members a collection of members attached to the provided class node
 * @returns the updated component class declaration
 */
export declare const updateComponentClass: (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, heritageClauses: ts.HeritageClause[] | ts.NodeArray<ts.HeritageClause>, members: ts.ClassElement[]) => ts.ClassDeclaration | ts.VariableStatement;
