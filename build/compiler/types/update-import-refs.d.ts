import type * as d from '../../declarations';
/**
 * Find all referenced types by a component and add them to the `importDataObj` parameter
 * @param importDataObj an output parameter that contains the imported types seen thus far by the compiler
 * @param typeCounts a map of seen types and the number of times the type has been seen
 * @param cmp the metadata associated with the component whose types are being inspected
 * @param filePath the path of the component file
 * @param config The Stencil config for the project
 * @returns the updated import data
 */
export declare const updateReferenceTypeImports: (importDataObj: d.TypesImportData, typeCounts: Map<string, number>, cmp: d.ComponentCompilerMeta, filePath: string, config: d.ValidatedConfig) => d.TypesImportData;
