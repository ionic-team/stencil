import { ResolveIdResult } from 'rollup';
import type * as d from '../../declarations';
import { InMemoryFileSystem } from '../sys/in-memory-fs';
export declare const devNodeModuleResolveId: (config: d.ValidatedConfig, inMemoryFs: InMemoryFileSystem, resolvedId: ResolveIdResult, importee: string) => Promise<ResolveIdResult>;
