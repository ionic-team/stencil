import type * as d from '../../declarations';
/**
 * Generates the individual event types for all @Prop() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @returns the generated type metadata
 */
export declare const generatePropTypes: (cmpMeta: d.ComponentCompilerMeta, typeImportData: d.TypesImportData) => d.TypeInfo;
