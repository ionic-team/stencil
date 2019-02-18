
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
export class MockPerformance implements Performance {
  timeOrigin: number;

  constructor() {
    this.timeOrigin = Date.now();
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
    return [] as any;
  }

  getEntriesByName() {
    return [] as any;
  }

  getEntriesByType() {
    return [] as any;
  }

  mark() {
    //
  }

  measure() {
    //
  }

  get navigation() {
    return {} as any;
  }

  now() {
    return Date.now() - this.timeOrigin;
  }

  get onresourcetimingbufferfull() {
    return null as any;
  }

  removeEventListener() {
    //
  }

  setResourceTimingBufferSize() {
    //
  }

  get timing() {
    return {} as any;
  }

  toJSON() {
    //
  }

}

export function resetPerformance(perf: Performance) {
  if (perf != null) {
    try {
      (perf as MockPerformance).timeOrigin = Date.now();
    } catch (e) {}
  }
}
