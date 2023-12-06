import type * as d from '../../../declarations';
/**
 * A fetch wrapper which dispatches to `sys.fetch` if present, and otherwise
 * uses `global.fetch`.
 *
 * @param sys a compiler system object
 * @param input a `RequestInfo` object
 * @param init an optional `RequestInit` object
 * @returns a Promise wrapping a response
 */
export declare const httpFetch: (sys: d.CompilerSystem, input: RequestInfo, init?: RequestInit) => Promise<Response>;
export declare const packageVersions: Map<string, string>;
export declare const known404Urls: Set<string>;
/**
 * Get the URL for a Stencil module given the path to the compiler
 *
 * @param compilerExe the path to the compiler executable
 * @param path the path to the module or file in question
 * @returns a URL for the file of interest
 */
export declare const getStencilModuleUrl: (compilerExe: string, path: string) => string;
export declare const skipFilePathFetch: (filePath: string) => boolean;
export declare const skipUrlFetch: (url: string) => boolean;
