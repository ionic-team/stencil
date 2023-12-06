import type { SerializedEvent } from '@stencil/core/internal';
import type * as puppeteer from 'puppeteer';
import type * as pd from './puppeteer-declarations';
export declare function initPageEvents(page: pd.E2EPageInternal): Promise<void>;
export declare function waitForEvent(page: pd.E2EPageInternal, eventName: string, elementHandle: puppeteer.ElementHandle): Promise<any>;
export declare class EventSpy implements EventSpy {
    eventName: string;
    events: SerializedEvent[];
    private cursor;
    private queuedHandler;
    constructor(eventName: string);
    get length(): number;
    get firstEvent(): SerializedEvent;
    get lastEvent(): SerializedEvent;
    next(): Promise<{
        done: boolean;
        value: SerializedEvent;
    }>;
    push(ev: SerializedEvent): void;
}
export declare function addE2EListener(page: pd.E2EPageInternal, elmHandle: puppeteer.JSHandle, eventName: string, callback: (ev: any) => void): Promise<void>;
