import { MockNode } from './node';
export declare class MockComment extends MockNode {
    constructor(ownerDocument: any, data: string);
    cloneNode(_deep?: boolean): MockComment;
    get textContent(): string;
    set textContent(text: string);
}
