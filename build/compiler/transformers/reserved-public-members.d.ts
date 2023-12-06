import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Determine if a public class member collides with a reserved name for HTML elements, nodes, or JSX
 * @param diagnostics a collection of compiler diagnostics. If a naming collision is found, a diagnostic detected must
 * be added to this collection
 * @param memberName the name of the class member to check for collision
 * @param decorator the decorator associated with the class member, used in providing richer error diagnostics
 * @param memberType a string representing the class member's type. e.g. 'prop'. Used in providing richer error
 * diagnostics
 * @param node the TypeScript AST node at which the class member is defined
 */
export declare const validatePublicName: (diagnostics: d.Diagnostic[], memberName: string, decorator: string, memberType: string, node: ts.Node) => void;
