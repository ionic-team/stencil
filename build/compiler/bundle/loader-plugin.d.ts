import type { Plugin } from 'rollup';
/**
 * Rollup plugin that aids in resolving the entry points (1 or more files) for a Stencil project. For example, a project
 * using the `dist-custom-elements` output target may have a single 'entry point' for each file containing a component.
 * Each of those files will be independently resolved and loaded by this plugin for further processing by Rollup later
 * in the bundling process.
 *
 * @param entries the Stencil project files to process. It should be noted that the keys in this object may not
 * necessarily be an absolute or relative path to a file, but may be a Rollup Virtual Module (which begin with \0).
 * @returns the rollup plugin that loads and process a Stencil project's entry points
 */
export declare const loaderPlugin: (entries?: {
    [id: string]: string;
}) => Plugin;
