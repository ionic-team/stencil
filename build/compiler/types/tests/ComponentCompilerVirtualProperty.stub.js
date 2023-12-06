/**
 * Generates a stub {@link ComponentCompilerVirtualProperty}. This function uses sensible defaults for the initial
 * stub. However, any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerVirtualProperty`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerVirtualProperty`
 */
export const stubComponentCompilerVirtualProperty = (overrides = {}) => {
    const defaults = {
        docs: 'this is a doc string',
        name: 'virtualPropName',
        type: 'number',
    };
    return { ...defaults, ...overrides };
};
//# sourceMappingURL=ComponentCompilerVirtualProperty.stub.js.map