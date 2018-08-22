
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
export class MockPerformance {
  private startMs = Date.now();

  clearMarks() {
    //
  }

  clearMeasures() {
    //
  }

  clearResourceTimings() {
    //
  }

  getEntries() {
    //
  }

  getEntriesByName() {
    //
  }

  getEntriesByType() {
    //
  }

  mark() {
    //
  }

  measure() {
    //
  }

  now() {
    return Date.now() - this.startMs;
  }

  setResourceTimingBufferSize() {
    //
  }

  toJSON() {
    //
  }

}
