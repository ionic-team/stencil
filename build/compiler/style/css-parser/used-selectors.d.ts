export declare const getUsedSelectors: (elm: Element) => UsedSelectors;
export interface UsedSelectors {
    tags: Set<string>;
    classNames: Set<string>;
    ids: Set<string>;
    attrs: Set<string>;
}
