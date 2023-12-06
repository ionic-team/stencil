import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const parseStaticStyles: (compilerCtx: d.CompilerCtx, tagName: string, componentFilePath: string, isCollectionDependency: boolean, staticMembers: ts.ClassElement[]) => d.StyleCompiler[];
