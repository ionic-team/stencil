import ts from 'typescript';
import type * as d from '../../../declarations';
import { InMemoryFileSystem } from '../in-memory-fs';
export declare const patchTsSystemFileSystem: (config: d.ValidatedConfig, compilerSys: d.CompilerSystem, inMemoryFs: InMemoryFileSystem, tsSys: ts.System) => ts.System;
export declare const patchTypescript: (config: d.ValidatedConfig, inMemoryFs: InMemoryFileSystem) => void;
export declare const getTypescriptPathFromUrl: (config: d.ValidatedConfig, tsExecutingUrl: string, url: string) => string;
