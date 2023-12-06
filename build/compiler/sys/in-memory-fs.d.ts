import type * as d from '@stencil/core/internal';
/**
 * An in-memory FS which proxies the underlying OS filesystem using a simple
 * in-memory cache. FS writes can accumulate on the in-memory system, using an
 * API similar to Node.js' `"fs"` module, and then be committed to disk as a
 * unit.
 *
 * Files written to the in-memory system can be edited, deleted, and so on.
 * This allows the compiler to proceed freely as if it is modifying the
 * filesystem, modifying the world in whatever way suits it, while deferring
 * actual FS writes until the end of the compilation process, making actual
 * changes to the filesystem on disk contingent on an error-free build or any
 * other condition.
 *
 * Usage example:
 *
 * ```ts
 * // create an in-memory FS
 * const sys = createSystem();
 * const inMemoryFs = createInMemoryFs(sys);
 *
 * // do a few fs operations
 * await inMemoryFs.writeFile("path/to/file.js", 'console.log("hey!");')
 * await inMemoryFs.remove("path/to/another_file.ts");
 *
 * // commit the results to disk
 * const commitStats = await inMemoryFs.commit();
 * ```
 *
 * In the above example the write operation and the delete operation (w/
 * `.remove`) are both queued in the in-memory proxy but not committed to
 * disk until the `.commit` method is called.
 */
export type InMemoryFileSystem = ReturnType<typeof createInMemoryFs>;
/**
 * A node in the in-memory file system. This may represent a file or
 * a directory, and pending copy, write, and delete operations may be stored
 * on it.
 */
export interface FsItem {
    fileText: string;
    isFile: boolean;
    isDirectory: boolean;
    size: number;
    mtimeMs: number;
    exists: boolean;
    queueCopyFileToDest: string;
    queueWriteToDisk: boolean;
    queueDeleteFromDisk?: boolean;
    useCache: boolean;
}
/**
 * Storage format for the in-memory cache used to proxy the OS filesystem.
 *
 * Filesystem paths (of type `string`) are mapped to objects satisfying the
 * `FsItem` interface.
 */
export type FsItems = Map<string, FsItem>;
/**
 * Options supported by write methods on the in-memory filesystem.
 */
export interface FsWriteOptions {
    /**
     * only use the in-memory cache and do not write the file to disk
     */
    inMemoryOnly?: boolean;
    clearFileCache?: boolean;
    /**
     * flush the write to disk immediately, skipping the in-memory cache
     */
    immediateWrite?: boolean;
    /**
     * specify that the cache should be used
     */
    useCache?: boolean;
    /**
     * An optional tag for the current output target for which this file is being
     * written.
     */
    outputTargetType?: string;
}
/**
 * Results from a write operation on the in-memory filesystem.
 */
export interface FsWriteResults {
    changedContent: boolean;
    queuedWrite: boolean;
    ignored: boolean;
}
/**
 * Options supported by read methods on the in-memory filesystem.
 */
export interface FsReadOptions {
    useCache?: boolean;
    setHash?: boolean;
}
/**
 * Options supported by the readdir option on the in-memory filesystem.
 */
interface FsReaddirOptions {
    inMemoryOnly?: boolean;
    recursive?: boolean;
    /**
     * Directory names to exclude. Just the basename,
     * not the entire path. Basically for "node_modules".
     */
    excludeDirNames?: string[];
    /**
     * Extensions we know we can avoid. Each extension
     * should include the `.` so that we can test for both
     * `.d.ts.` and `.ts`. If `excludeExtensions` isn't provided it
     * doesn't try to exclude anything. This only checks against
     * the filename, not directory names when recursive.
     */
    excludeExtensions?: string[];
}
/**
 * A result from a directory read operation
 */
interface FsReaddirItem {
    absPath: string;
    relPath: string;
    isDirectory: boolean;
    isFile: boolean;
}
/**
 * Information about a file in the in-memory filesystem.
 */
interface FsStat {
    exists: boolean;
    isFile: boolean;
    isDirectory: boolean;
    size: number;
}
/**
 * Create an in-memory FS which proxies the underlying OS filesystem using an
 * in-memory cache. FS writes can accumulate on the in-memory system, using an
 * API similar to Node.js' `"fs"` module, and then be committed to disk as a
 * unit.
 *
 * Files written to the in-memory system can be edited, deleted, and so on.
 * This allows the compiler to proceed freely as if it is modifying the
 * filesystem, modifying the world in whatever way suits it, while deferring
 * actual FS writes until the end of the compilation process, making actual
 * changes to the filesystem on disk contingent on an error-free build or any
 * other condition.
 *
 * @param sys a compiler system object
 * @returns an in-memory filesystem interface
 */
export declare const createInMemoryFs: (sys: d.CompilerSystem) => {
    access: (filePath: string) => Promise<boolean>;
    accessSync: (filePath: string) => boolean;
    cancelDeleteDirectoriesFromDisk: (dirPaths: string[]) => void;
    cancelDeleteFilesFromDisk: (filePaths: string[]) => void;
    clearCache: () => void;
    clearDirCache: (dirPath: string) => void;
    clearFileCache: (filePath: string) => void;
    commit: () => Promise<FsCommitResults>;
    copyFile: (src: string, dest: string) => Promise<void>;
    emptyDirs: (dirs: string[]) => Promise<void>;
    getBuildOutputs: () => d.BuildOutput[];
    getItem: (itemPath: string) => FsItem;
    getMemoryStats: () => string;
    readFile: (filePath: string, opts?: FsReadOptions) => Promise<string>;
    readFileSync: (filePath: string, opts?: FsReadOptions) => string;
    readdir: (dirPath: string, opts?: FsReaddirOptions) => Promise<FsReaddirItem[]>;
    remove: (itemPath: string) => Promise<void>;
    stat: (itemPath: string) => Promise<FsStat>;
    statSync: (itemPath: string) => FsStat;
    sys: d.CompilerSystem;
    writeFile: (filePath: string, content: string, opts?: FsWriteOptions) => Promise<FsWriteResults>;
    writeFiles: (files: {
        [filePath: string]: string;
    } | Map<string, string>, opts?: FsWriteOptions) => Promise<FsWriteResults[]>;
};
/**
 * The information needed to carry out a file copy operation.
 *
 * `[ source, destination ]`
 */
type FileCopyTuple = [string, string];
/**
 * Collected instructions for all pending filesystem operations saved
 * to the in-memory filesystem.
 */
interface FsCommitInstructions {
    filesToDelete: string[];
    filesToWrite: string[];
    /**
     * Files queued for copy operations are stored as an array of `[source, dest]`
     * tuples.
     */
    filesToCopy: FileCopyTuple[];
    dirsToDelete: string[];
    dirsToEnsure: string[];
}
/**
 * Results from committing pending filesystem operations
 */
interface FsCommitResults {
    filesCopied: FileCopyTuple[];
    filesWritten: string[];
    filesDeleted: string[];
    dirsDeleted: string[];
    dirsAdded: string[];
}
/**
 * Given the current state of the in-memory proxy filesystem, collect all of
 * the changes that need to be made in order to commit the currently-pending
 * operations (e.g. write, copy, delete) to the OS filesystem.
 *
 * @param items the storage data structure for the in-memory FS cache
 * @returns a collection of all the operations that need to be done
 */
export declare const getCommitInstructions: (items: FsItems) => FsCommitInstructions;
/**
 * Check whether a given filepath should be ignored
 *
 * We have a little ignore list, and we just check whether the
 * filepath ends with any of the strings on the ignore list.
 *
 * @param filePath the filepath to check!
 * @returns whether we should ignore it or not
 */
export declare const shouldIgnore: (filePath: string) => boolean;
export {};
