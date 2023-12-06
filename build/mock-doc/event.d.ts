import { MockElement } from './node';
import { MockWindow } from './window';
export declare class MockEvent {
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    currentTarget: MockElement;
    defaultPrevented: boolean;
    srcElement: MockElement;
    target: MockElement;
    timeStamp: number;
    type: string;
    constructor(type: string, eventInitDict?: EventInit);
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    composedPath(): MockElement[];
}
export declare class MockCustomEvent extends MockEvent {
    detail: any;
    constructor(type: string, customEventInitDic?: CustomEventInit);
}
export declare class MockKeyboardEvent extends MockEvent {
    code: string;
    key: string;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    location: number;
    repeat: boolean;
    constructor(type: string, keyboardEventInitDic?: KeyboardEventInit);
}
export declare class MockMouseEvent extends MockEvent {
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    button: number;
    buttons: number;
    relatedTarget: EventTarget;
    constructor(type: string, mouseEventInitDic?: MouseEventInit);
}
export declare class MockUIEvent extends MockEvent {
    detail: number | null;
    view: MockWindow | null;
    constructor(type: string, uiEventInitDic?: UIEventInit);
}
export declare class MockFocusEvent extends MockUIEvent {
    relatedTarget: EventTarget | null;
    constructor(type: 'blur' | 'focus', focusEventInitDic?: FocusEventInit);
}
export declare class MockEventListener {
    type: string;
    handler: (ev?: any) => void;
    constructor(type: string, handler: any);
}
export declare function addEventListener(elm: any, type: string, handler: any): void;
export declare function removeEventListener(elm: any, type: string, handler: any): void;
export declare function resetEventListeners(target: any): void;
export declare function dispatchEvent(currentTarget: any, ev: MockEvent): boolean;
export interface EventTarget {
    __listeners: MockEventListener[];
}
