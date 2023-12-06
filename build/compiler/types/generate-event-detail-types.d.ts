import type * as d from '../../declarations';
/**
 * Generates the custom event interface for each component that combines the `CustomEvent` interface with
 * the HTMLElement target. This is used to allow implementers to use strict typings on event handlers.
 *
 * The generated interface accepts a generic for the event detail type. This allows implementers to use
 * custom typings for individual events without Stencil needing to generate an interface for each event.
 *
 * @param cmp The component compiler metadata
 * @returns The generated interface type definition.
 */
export declare const generateEventDetailTypes: (cmp: d.ComponentCompilerMeta) => d.TypesModule;
