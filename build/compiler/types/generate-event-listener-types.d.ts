import type * as d from '../../declarations';
/**
 * Generates event listener properties for the component's html element type. This is used to allow implementers
 * to use strict typings when adding and removing event listeners.
 *
 * @param cmp The component compiler metadata
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @returns additional types information to add event listener method overloads for component's html element type
 */
export declare const generateEventListenerTypes: (cmp: d.ComponentCompilerMeta, typeImportData: d.TypesImportData) => {
    htmlElementEventMap: string[];
    htmlElementEventListenerProperties: string[];
};
