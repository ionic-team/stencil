import type * as d from '../declarations';
import type { CoreCompiler } from './load-compiler';
export declare const taskBuild: (coreCompiler: CoreCompiler, config: d.ValidatedConfig) => Promise<void>;
