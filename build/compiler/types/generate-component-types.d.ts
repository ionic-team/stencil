import type * as d from '../../declarations';
/**
 * Generate a string based on the types that are defined within a component
 * @param cmp the metadata for the component that a type definition string is generated for
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @param areTypesInternal `true` if types being generated are for a project's internal purposes, `false` otherwise
 * @returns the generated types string alongside additional metadata
 */
export declare const generateComponentTypes: (cmp: d.ComponentCompilerMeta, typeImportData: d.TypesImportData, areTypesInternal: boolean) => d.TypesModule;
