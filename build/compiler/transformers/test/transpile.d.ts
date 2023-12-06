import type * as d from '@stencil/core/declarations';
import ts from 'typescript';
/**
 * Testing utility for transpiling provided string containing valid Stencil code
 *
 * @param input the code to transpile
 * @param config a Stencil configuration to apply during the transpilation
 * @param compilerCtx a compiler context to use in the transpilation process
 * @param beforeTransformers TypeScript transformers that should be applied before the code is emitted
 * @param afterTransformers TypeScript transformers that should be applied after the code is emitted
 * @param afterDeclarations TypeScript transformers that should be applied
 * after declarations are generated
 * @param tsConfig optional typescript compiler options to use
 * @param inputFileName a dummy filename to use for the module (defaults to `module.tsx`)
 * @returns the result of the transpilation step
 */
export declare function transpileModule(input: string, config?: d.ValidatedConfig | null, compilerCtx?: d.CompilerCtx | null, beforeTransformers?: ts.TransformerFactory<ts.SourceFile>[], afterTransformers?: ts.TransformerFactory<ts.SourceFile>[], afterDeclarations?: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[], tsConfig?: ts.CompilerOptions, inputFileName?: string): {
    buildCtx: d.BuildCtx;
    cmp: d.ComponentCompilerMeta;
    cmps: d.ComponentCompilerMeta[];
    compilerCtx: d.CompilerCtx;
    componentClassName: string;
    declarationOutputText: string;
    diagnostics: d.Diagnostic[];
    elementRef: string;
    event: d.ComponentCompilerEvent;
    events: d.ComponentCompilerEvent[];
    listener: d.ComponentCompilerListener;
    listeners: d.ComponentCompilerListener[];
    method: d.ComponentCompilerMethod;
    methods: d.ComponentCompilerMethod[];
    moduleFile: d.Module;
    outputText: string;
    properties: d.ComponentCompilerProperty[];
    property: d.ComponentCompilerProperty;
    state: d.ComponentCompilerState;
    states: d.ComponentCompilerState[];
    tagName: string;
    virtualProperties: d.ComponentCompilerVirtualProperty[];
};
/**
 * Helper function for tests that converts stringified JavaScript to a runtime value.
 * A value from the generated JavaScript is returned based on the provided property name.
 * @param stringifiedJs the stringified JavaScript
 * @param propertyName the property name to pull off the generated JavaScript
 * @returns the value associated with the provided property name. Returns undefined if an error occurs while converting
 * the stringified JS to JavaScript, or if the property does not exist on the generated JavaScript.
 */
export declare function getStaticGetter(stringifiedJs: string, propertyName: string): string | void;
