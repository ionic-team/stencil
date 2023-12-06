/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
export declare class MockPerformance implements Performance {
    timeOrigin: number;
    eventCounts: EventCounts;
    constructor();
    addEventListener(): void;
    clearMarks(): void;
    clearMeasures(): void;
    clearResourceTimings(): void;
    dispatchEvent(): boolean;
    getEntries(): any;
    getEntriesByName(): any;
    getEntriesByType(): any;
    mark(): PerformanceMark;
    measure(): PerformanceMeasure;
    get navigation(): any;
    now(): number;
    get onresourcetimingbufferfull(): any;
    removeEventListener(): void;
    setResourceTimingBufferSize(): void;
    get timing(): any;
    toJSON(): void;
}
export declare function resetPerformance(perf: Performance): void;
