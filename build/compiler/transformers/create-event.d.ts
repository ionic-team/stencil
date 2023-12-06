import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * For a Stencil component, generate the code to create custom emitted events, based on `@Event()` decorators
 * @param moduleFile the 'home module' of the class for which code is being generated
 * @param cmp the component metadata associated with the provided module
 * @returns the generated event creation code
 */
export declare const addCreateEvents: (moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => ts.ExpressionStatement[];
