import type * as d from '../../declarations';
/**
 * Ensures that the `namespace` and `fsNamespace` properties on a project's
 * Stencil config are valid strings. A valid namespace means:
 * - at least 3 characters
 * - cannot start with a number or dash
 * - cannot end with a dash
 * - must only contain alphanumeric, dash, and dollar sign characters
 *
 * If any conditions are not met, a diagnostic is added to the provided array.
 *
 * If a namespace is not provided, the default value is `App`.
 *
 * @param namespace The namespace to validate
 * @param fsNamespace The fsNamespace to validate
 * @param diagnostics The array of diagnostics to add to if the namespace is invalid
 * @returns The validated namespace and fsNamespace
 */
export declare const validateNamespace: (namespace: string | undefined, fsNamespace: string | undefined, diagnostics: d.Diagnostic[]) => {
    namespace: string;
    fsNamespace: string;
};
export declare const validateDistNamespace: (config: d.UnvalidatedConfig, diagnostics: d.Diagnostic[]) => void;
