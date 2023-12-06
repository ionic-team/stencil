import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Import and define components along with any component dependents within the `dist-custom-elements` output.
 * Adds `defineCustomElement()` function for all components.
 * @param compilerCtx - current compiler context
 * @param components - all current components within the stencil buildCtx
 * @param outputTarget - the output target being compiled
 * @returns a TS AST transformer factory function
 */
export declare const addDefineCustomElementFunctions: (compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: d.OutputTargetDistCustomElements) => ts.TransformerFactory<ts.SourceFile>;
