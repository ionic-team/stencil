import { MockNode } from './node';
export declare function serializeNodeToHtml(elm: Node | MockNode, opts?: SerializeNodeToHtmlOptions): string;
export declare const NON_ESCAPABLE_CONTENT: Set<string>;
export declare const WHITESPACE_SENSITIVE: Set<string>;
export interface SerializeNodeToHtmlOptions {
    approximateLineWidth?: number;
    excludeTagContent?: string[];
    excludeTags?: string[];
    indentSpaces?: number;
    newLines?: boolean;
    outerHtml?: boolean;
    prettyHtml?: boolean;
    removeAttributeQuotes?: boolean;
    removeBooleanAttributeQuotes?: boolean;
    removeEmptyAttributes?: boolean;
    removeHtmlComments?: boolean;
    serializeShadowRoot?: boolean;
}
