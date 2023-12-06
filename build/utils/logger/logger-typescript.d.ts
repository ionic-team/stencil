import type { Diagnostic, Node } from 'typescript';
import type * as d from '../../declarations';
/**
 * Augment a `Diagnostic` with information from a `Node` in the AST to provide richer error information
 * @param d the diagnostic to augment
 * @param node the node to augment with additional information
 * @returns the augmented diagnostic
 */
export declare const augmentDiagnosticWithNode: (d: d.Diagnostic, node: Node) => d.Diagnostic;
/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */
export declare const loadTypeScriptDiagnostics: (tsDiagnostics: readonly Diagnostic[]) => d.Diagnostic[];
/**
 * Convert a TypeScript diagnostic object into our internal, Stencil-specific
 * diagnostic format
 *
 * @param tsDiagnostic a TypeScript diagnostic message record
 * @returns a Stencil diagnostic, suitable for showing an error to the user
 */
export declare const loadTypeScriptDiagnostic: (tsDiagnostic: Diagnostic) => d.Diagnostic;
