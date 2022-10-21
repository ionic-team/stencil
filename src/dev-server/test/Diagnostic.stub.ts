import { Diagnostic } from '../../compiler/diagnostic';

/**
 * Generates a stub {@link Diagnostic}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `Diagnostic`. Any provided fields will override the defaults provided
 * by this function.
 * @returns the stubbed `Diagnostic`
 */
export const stubDiagnostic = (overrides: Partial<Diagnostic> = {}): Diagnostic => {
  const defaults: Diagnostic = {
    absFilePath: null,
    header: 'Mock Error',
    level: 'error',
    lines: [],
    messageText: 'mock error',
    relFilePath: null,
    type: 'mock',
  };

  return { ...defaults, ...overrides };
};
