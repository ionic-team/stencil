import type { RollupOutput } from 'rollup';
import type * as d from '../../../declarations';
export declare const writeHydrateOutputs: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], rollupOutput: RollupOutput) => Promise<void[]>;
