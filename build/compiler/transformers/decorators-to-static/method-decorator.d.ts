import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const methodDecoratorsToStatic: (config: d.ValidatedConfig, diagnostics: d.Diagnostic[], cmpNode: ts.ClassDeclaration, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, program: ts.Program, newMembers: ts.ClassElement[]) => void;
export declare const validateMethods: (diagnostics: d.Diagnostic[], members: ts.NodeArray<ts.ClassElement>) => void;
