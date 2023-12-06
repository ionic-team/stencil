import * as d from '@stencil/core/declarations';
/**
 * Generates a stub {@link ComponentCompilerProperty}. This function uses sensible defaults for the initial stub.
 * However, any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerProperty`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerProperty`
 */
export declare const stubComponentCompilerProperty: (overrides?: Partial<d.ComponentCompilerProperty>) => d.ComponentCompilerProperty;
