import type * as d from '../../../declarations';
import { UsedSelectors } from './used-selectors';
export interface ParseCssResults {
    diagnostics: d.Diagnostic[];
    stylesheet: CssNode;
}
export declare const enum CssNodeType {
    Charset = 0,
    Comment = 1,
    CustomMedia = 2,
    Document = 3,
    Declaration = 4,
    FontFace = 5,
    Host = 6,
    Import = 7,
    KeyFrames = 8,
    KeyFrame = 9,
    Media = 10,
    Namespace = 11,
    Page = 12,
    Rule = 13,
    StyleSheet = 14,
    Supports = 15
}
export interface CssNode {
    type?: CssNodeType;
    charset?: string;
    comment?: string;
    declarations?: CssNode[] | null;
    document?: string;
    import?: string;
    keyframes?: CssNode[] | null;
    media?: string;
    name?: string;
    namespace?: string;
    page?: string;
    position?: CssParsePosition;
    property?: string;
    rules?: CssNode[] | null;
    selectors?: string[];
    source?: string;
    stylesheet?: CssNode | null;
    supports?: string;
    value?: string;
    values?: string[];
    vendor?: string;
}
export interface CssParsePosition {
    start: any;
    end: any;
    source: any;
    content: string;
}
export interface SerializeCssOptions {
    usedSelectors?: UsedSelectors;
}
export interface SerializeOpts extends SerializeCssOptions {
    hasUsedAttrs: boolean;
    hasUsedClassNames: boolean;
    hasUsedIds: boolean;
    hasUsedTags: boolean;
    usedSelectors: UsedSelectors | null;
}
