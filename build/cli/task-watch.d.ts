import type { ValidatedConfig } from '../declarations';
import type { CoreCompiler } from './load-compiler';
export declare const taskWatch: (coreCompiler: CoreCompiler, config: ValidatedConfig) => Promise<void>;
