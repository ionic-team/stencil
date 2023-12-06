import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Given an instance of TypeScript's Intermediate Representation (IR) for a
 * class declaration ({@see ts.ClassDeclaration}) which represents a Stencil
 * component class declaration, parse and format various pieces of data about
 * static class members which we use in the compilation process
 *
 * @param compilerCtx the current compiler context
 * @param typeChecker a TypeScript type checker instance
 * @param cmpNode the TypeScript class declaration for the component
 * @param moduleFile Stencil's IR for a module, used here as an out param
 * @param transformOpts options which control various aspects of the
 * transformation
 * @returns the TypeScript class declaration IR instance with which the
 * function was called
 */
export declare const parseStaticComponentMeta: (compilerCtx: d.CompilerCtx, typeChecker: ts.TypeChecker, cmpNode: ts.ClassDeclaration, moduleFile: d.Module, transformOpts?: d.TransformOptions) => ts.ClassDeclaration;
