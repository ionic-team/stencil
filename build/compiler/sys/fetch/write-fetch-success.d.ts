import type * as d from '../../../declarations';
import { InMemoryFileSystem } from '../in-memory-fs';
export declare const writeFetchSuccessSync: (sys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => void;
export declare const writeFetchSuccessAsync: (sys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => Promise<void>;
