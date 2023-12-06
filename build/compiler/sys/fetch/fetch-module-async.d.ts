import type * as d from '../../../declarations';
import { InMemoryFileSystem } from '../in-memory-fs';
export declare const fetchModuleAsync: (sys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, pkgVersions: Map<string, string>, url: string, filePath: string) => Promise<string>;
