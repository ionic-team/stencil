import * as d from '@stencil/core/declarations';
/**
 * Generates a stub {@link ComponentCompilerTypeReference}. This function uses sensible defaults for the initial stub.
 * However, any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerTypeReference`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerTypeReference`
 */
export declare const stubComponentCompilerTypeReference: (overrides?: Partial<d.ComponentCompilerTypeReference>) => d.ComponentCompilerTypeReference;
