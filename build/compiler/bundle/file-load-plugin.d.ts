import type { Plugin } from 'rollup';
import { InMemoryFileSystem } from '../sys/in-memory-fs';
export declare const fileLoadPlugin: (fs: InMemoryFileSystem) => Plugin;
