/**
 * Generates a stub {@link d.Diagnostic}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `Diagnostic`. Any provided fields will override the defaults provided
 * by this function.
 * @returns the stubbed `Diagnostic`
 */
export const stubDiagnostic = (overrides = {}) => {
    const defaults = {
        absFilePath: undefined,
        header: 'Mock Error',
        level: 'error',
        lines: [],
        messageText: 'mock error',
        relFilePath: undefined,
        type: 'mock',
    };
    return { ...defaults, ...overrides };
};
//# sourceMappingURL=Diagnostic.stub.js.map