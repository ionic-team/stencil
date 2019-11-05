
import { MockNode, serializeNodeToHtml } from '@mock-doc';

const print = (val: HTMLElement | MockNode): string => {
    return serializeNodeToHtml(val, {
        serializeShadowRoot: true,
        prettyHtml: true,
        outerHtml: true,
    });
};

const test = (val: any): boolean => {
    return val !== undefined &&
    val !== null &&
    (val instanceof HTMLElement || val instanceof MockNode);
};

export const HtmlSerializer = {
    print,
    test
};
