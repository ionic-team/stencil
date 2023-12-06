import { MockCSSStyleSheet } from './css-style-sheet';
import { MockDocumentFragment } from './document-fragment';
import { MockElement, MockHTMLElement } from './node';
export declare function createElement(ownerDocument: any, tagName: string): any;
export declare function createElementNS(ownerDocument: any, namespaceURI: string, tagName: string): any;
export declare class MockAnchorElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
    get pathname(): string;
}
export declare class MockButtonElement extends MockHTMLElement {
    constructor(ownerDocument: any);
}
export declare class MockImageElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get draggable(): boolean;
    set draggable(value: boolean);
    get src(): string;
    set src(value: string);
}
export declare class MockInputElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get list(): HTMLElement;
}
export declare class MockFormElement extends MockHTMLElement {
    constructor(ownerDocument: any);
}
export declare class MockLinkElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
}
export declare class MockMetaElement extends MockHTMLElement {
    content: string;
    constructor(ownerDocument: any);
}
export declare class MockScriptElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get src(): string;
    set src(value: string);
}
export declare class MockDOMMatrix {
    static fromMatrix(): MockDOMMatrix;
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;
    is2D: boolean;
    isIdentity: boolean;
    inverse(): MockDOMMatrix;
    flipX(): MockDOMMatrix;
    flipY(): MockDOMMatrix;
    multiply(): MockDOMMatrix;
    rotate(): MockDOMMatrix;
    rotateAxisAngle(): MockDOMMatrix;
    rotateFromVector(): MockDOMMatrix;
    scale(): MockDOMMatrix;
    scaleNonUniform(): MockDOMMatrix;
    skewX(): MockDOMMatrix;
    skewY(): MockDOMMatrix;
    toJSON(): void;
    toString(): void;
    transformPoint(): MockDOMPoint;
    translate(): MockDOMMatrix;
}
export declare class MockDOMPoint {
    w: number;
    x: number;
    y: number;
    z: number;
    toJSON(): void;
    matrixTransform(): MockDOMMatrix;
}
export declare class MockSVGRect {
    height: number;
    width: number;
    x: number;
    y: number;
}
export declare class MockStyleElement extends MockHTMLElement {
    sheet: MockCSSStyleSheet;
    constructor(ownerDocument: any);
    get innerHTML(): string;
    set innerHTML(value: string);
    get innerText(): string;
    set innerText(value: string);
    get textContent(): string;
    set textContent(value: string);
}
export declare class MockSVGElement extends MockElement {
    __namespaceURI: string;
    get ownerSVGElement(): SVGSVGElement;
    get viewportElement(): SVGElement;
    onunload(): void;
    get pathLength(): number;
    isPointInFill(_pt: DOMPoint): boolean;
    isPointInStroke(_pt: DOMPoint): boolean;
    getTotalLength(): number;
}
export declare class MockSVGGraphicsElement extends MockSVGElement {
    getBBox(_options?: {
        clipped: boolean;
        fill: boolean;
        markers: boolean;
        stroke: boolean;
    }): MockSVGRect;
    getCTM(): MockDOMMatrix;
    getScreenCTM(): MockDOMMatrix;
}
export declare class MockSVGSVGElement extends MockSVGGraphicsElement {
    createSVGPoint(): MockDOMPoint;
}
export declare class MockSVGTextContentElement extends MockSVGGraphicsElement {
    getComputedTextLength(): number;
}
export declare class MockBaseElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
}
export declare class MockTemplateElement extends MockHTMLElement {
    content: MockDocumentFragment;
    constructor(ownerDocument: any);
    get innerHTML(): string;
    set innerHTML(html: string);
    cloneNode(deep?: boolean): MockTemplateElement;
}
export declare class MockTitleElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get text(): string;
    set text(value: string);
}
export declare class MockCanvasElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    getContext(): {
        fillRect(): void;
        clearRect(): void;
        getImageData: (_: number, __: number, w: number, h: number) => {
            data: any[];
        };
        putImageData(): void;
        createImageData: () => any[];
        setTransform(): void;
        drawImage(): void;
        save(): void;
        fillText(): void;
        restore(): void;
        beginPath(): void;
        moveTo(): void;
        lineTo(): void;
        closePath(): void;
        stroke(): void;
        translate(): void;
        scale(): void;
        rotate(): void;
        arc(): void;
        fill(): void;
        measureText(): {
            width: number;
        };
        transform(): void;
        rect(): void;
        clip(): void;
    };
}
