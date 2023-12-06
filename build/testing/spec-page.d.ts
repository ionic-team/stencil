import type { NewSpecPageOptions, SpecPage } from '@stencil/core/internal';
/**
 * Creates a new spec page for unit testing
 * @param opts the options to apply to the spec page that influence its configuration and operation
 * @returns the created spec page
 */
export declare function newSpecPage(opts: NewSpecPageOptions): Promise<SpecPage>;
