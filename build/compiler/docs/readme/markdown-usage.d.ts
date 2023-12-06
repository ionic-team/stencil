import type * as d from '../../../declarations';
export declare const usageToMarkdown: (usages: d.JsonDocsUsage) => string[];
export declare const mergeUsages: (usages: d.JsonDocsUsage) => {
    name: string;
    text: string;
}[];
