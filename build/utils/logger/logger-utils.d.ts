import type * as d from '../../declarations';
/**
 * Iterate through a series of diagnostics to provide minor fix-ups for various edge cases, deduplicate messages, etc.
 * @param compilerCtx the current compiler context
 * @param diagnostics the diagnostics to normalize
 * @returns the normalize documents
 */
export declare const normalizeDiagnostics: (compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[]) => d.Diagnostic[];
/**
 * Split a corpus by newlines. Carriage returns are treated a newlines.
 * @param sourceText the corpus to split
 * @returns the split text
 */
export declare const splitLineBreaks: (sourceText: string) => ReadonlyArray<string>;
export declare const escapeHtml: (unsafe: any) => any;
