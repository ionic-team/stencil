import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const listenDecoratorsToStatic: (diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, decoratedMembers: ts.ClassElement[], newMembers: ts.ClassElement[]) => void;
export declare const parseListener: (eventName: string, opts: d.ListenOptions, methodName: string) => d.ComponentCompilerListener;
