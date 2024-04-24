import { Readable } from 'stream';

export class RenderResultReadable extends Readable {
  #waiting = false
  #result: Generator<string, void, unknown>
  #iterators: Generator<string, void, unknown>[]
  #currentIterator: Generator<string, void, unknown> | undefined

  constructor(result: Generator<string, void, unknown>) {
      super();
      /**
       * `_waiting` flag is used to prevent multiple concurrent reads.
       *
       * RenderResultReadable handles async RenderResult's, and must await them.
       * While awaiting a result, it's possible for `_read` to be called again.
       * Without this flag, a new read is initiated and the order of the data in the
       * stream becomes inconsistent.
       */
      this.#waiting = false;
      this.#result = result;
      this.#iterators = [this.#result[Symbol.iterator]()];
  }
  override async _read (_size: number) {
      if (this.#waiting) {
          return;
      }
      // This implementation reads values from the RenderResult and pushes them
      // into the base class's Readable implementation. It tries to be as
      // efficient as possible, which means:
      //   1. Avoid microtasks and Promise allocations. Read and write values
      //      synchronously when possible.
      //   2. Write as many values to the Readable per call to _read() as
      //      possible.
      //
      // To do this correctly we must adhere to the Readable contract for
      // _read(), which states that:
      //
      // - The size parameter can be safely ignored
      // - _read() should call `this.push()` as many times as it can until
      //   `this.push()` returns false, which means the underlying Readable
      //   does not want any more values.
      // - `this.push(null)` ends the stream
      //
      // This means that we cannot use for/of loops to iterate on the render
      // result, because we must be able to return in the middle of the loop
      // and resume on the next call to _read().
      // Get the current iterator, only if we don't already have one from the
      // previous call to _read()
      this.#currentIterator ??= this.#iterators.pop();
      while (this.#currentIterator !== undefined) {
          const next = this.#currentIterator.next();
          if (next.done === true) {
              // Restore the outer iterator
              this.#currentIterator = this.#iterators.pop();
              continue;
          }
          const value = next.value;
          if (typeof value === 'string') {
              if (this.push(value) === false) {
                  // The consumer doesn't want any more values. Return for now and
                  // we may get a new call to _read()
                  return;
              }
          }
          else {
              // Must be a Promise
              this.#iterators.push(this.#currentIterator);
              this.#waiting = true;
              // @ts-expect-error
              this.#currentIterator = (await value)[Symbol.iterator]();
              this.#waiting = false;
          }
      }
      // Pushing `null` ends the stream
      this.push(null);
  }
}
