/**
 * Generates a stub {@link ComponentCompilerTypeReference}. This function uses sensible defaults for the initial stub.
 * However, any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerTypeReference`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerTypeReference`
 */
export const stubComponentCompilerTypeReference = (overrides = {}) => {
    const defaults = {
        location: 'global',
        id: 'placeholder',
    };
    return { ...defaults, ...overrides };
};
//# sourceMappingURL=ComponentCompilerTypeReference.stub.js.map