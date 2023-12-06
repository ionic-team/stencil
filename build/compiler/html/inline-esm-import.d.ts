import type * as d from '../../declarations';
/**
 * Attempt to optimize an ESM import of the main entry point for a `www` build
 * by inlining the imported script within the supplied HTML document, if
 * possible.
 *
 * This will only do this for a `<script>` with type `"module"` where the
 * `"src"` attr matches the main entry point for the build. If such a
 * `<script>` is found the imported file will be resolved and edited in order
 * to allow it to be properly inlined. If there's no such `<script>` _or_ if
 * the file referenced by the `<script>` can't be resolved then no action
 * will be taken.
 *
 * @param config the current user-supplied Stencil config
 * @param compilerCtx a compiler context
 * @param doc the document in which to search for scripts to inline
 * @param outputTarget the output target for the www build we're optimizing
 * @returns whether or not a script was found and inlined
 */
export declare const optimizeEsmImport: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, doc: Document, outputTarget: d.OutputTargetWww) => Promise<boolean>;
/**
 * Update all relative module specifiers in some JS code to instead be nested
 * inside of a supplied directory, transforming e.g. all imports of the form
 * `'./foo.js'` to `'/build/foo.js'`.
 *
 * @param code the code to transform
 * @param newDir the directory which should be prepended to all module
 * specifiers in the code
 * @returns a manifest containing transformed code and a list of transformed
 * module specifiers
 */
export declare const updateImportPaths: (code: string, newDir: string) => {
    code: string;
    orgImportPaths: string[];
};
