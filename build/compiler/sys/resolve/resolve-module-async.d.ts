import type * as d from '../../../declarations';
import { InMemoryFileSystem } from '../in-memory-fs';
export declare const resolveModuleIdAsync: (sys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, opts: d.ResolveModuleIdOptions) => Promise<d.ResolveModuleIdResults>;
export declare const createCustomResolverAsync: (sys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, exts: string[]) => any;
