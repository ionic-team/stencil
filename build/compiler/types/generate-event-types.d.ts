import type * as d from '../../declarations';
/**
 * Generates the individual event types for all @Event() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @param cmpClassName The pascal cased name of the component class
 * @returns the generated type metadata
 */
export declare const generateEventTypes: (cmpMeta: d.ComponentCompilerMeta, typeImportData: d.TypesImportData, cmpClassName: string) => d.TypeInfo;
