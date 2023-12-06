import type * as d from '@stencil/core/internal';
export declare function toHaveReceivedEvent(eventSpy: d.EventSpy): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveReceivedEventTimes(eventSpy: d.EventSpy, count: number): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveFirstReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any): {
    message: () => string;
    pass: boolean;
};
export declare function toHaveNthReceivedEventDetail(eventSpy: d.EventSpy, index: number, eventDetail: any): {
    message: () => string;
    pass: boolean;
};
