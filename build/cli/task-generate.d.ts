import type { ValidatedConfig } from '../declarations';
/**
 * Task to generate component boilerplate and write it to disk. This task can
 * cause the program to exit with an error under various circumstances, such as
 * being called in an inappropriate place, being asked to overwrite files that
 * already exist, etc.
 *
 * @param config the user-supplied config, which we need here to access `.sys`.
 * @returns a void promise
 */
export declare const taskGenerate: (config: ValidatedConfig) => Promise<void>;
/**
 * Get the boilerplate for a file by its extension.
 *
 * @param tagName the name of the component we're generating
 * @param extension the file extension we want boilerplate for (.css, tsx, etc)
 * @param withCss a boolean indicating whether we're generating a CSS file
 * @returns a string container the file boilerplate for the supplied extension
 */
export declare const getBoilerplateByExtension: (tagName: string, extension: GenerableExtension, withCss: boolean) => string;
/**
 * Extensions available to generate.
 */
export type GenerableExtension = 'tsx' | 'css' | 'spec.tsx' | 'e2e.ts';
/**
 * A little interface to wrap up the info we need to pass around for generating
 * and writing boilerplate.
 */
export interface BoilerplateFile {
    extension: GenerableExtension;
    /**
     * The full path to the file we want to generate.
     */
    path: string;
}
