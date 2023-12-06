import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const eventDecoratorsToStatic: (diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, program: ts.Program, newMembers: ts.ClassElement[]) => void;
export declare const getEventName: (eventOptions: d.EventOptions, memberName: string) => string;
