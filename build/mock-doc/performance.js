/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
export class MockPerformance {
    constructor() {
        this.timeOrigin = Date.now();
        this.eventCounts = new Map();
    }
    addEventListener() {
        //
    }
    clearMarks() {
        //
    }
    clearMeasures() {
        //
    }
    clearResourceTimings() {
        //
    }
    dispatchEvent() {
        return true;
    }
    getEntries() {
        return [];
    }
    getEntriesByName() {
        return [];
    }
    getEntriesByType() {
        return [];
    }
    // Stencil's implementation of `mark` is non-compliant with the `Performance` interface. Because Stencil will
    // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
    // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
    // associated errors returned by the type checker)
    // @ts-ignore
    mark() {
        //
    }
    // Stencil's implementation of `measure` is non-compliant with the `Performance` interface. Because Stencil will
    // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
    // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
    // associated errors returned by the type checker)
    // @ts-ignore
    measure() {
        //
    }
    get navigation() {
        return {};
    }
    now() {
        return Date.now() - this.timeOrigin;
    }
    get onresourcetimingbufferfull() {
        return null;
    }
    removeEventListener() {
        //
    }
    setResourceTimingBufferSize() {
        //
    }
    get timing() {
        return {};
    }
    toJSON() {
        //
    }
}
export function resetPerformance(perf) {
    if (perf != null) {
        try {
            perf.timeOrigin = Date.now();
        }
        catch (e) { }
    }
}
//# sourceMappingURL=performance.js.map