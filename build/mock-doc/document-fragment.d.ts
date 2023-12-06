import { MockElement, MockHTMLElement } from './node';
export declare class MockDocumentFragment extends MockHTMLElement {
    constructor(ownerDocument: any);
    getElementById(id: string): MockElement;
    cloneNode(deep?: boolean): MockDocumentFragment;
}
