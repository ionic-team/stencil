import type { RollupBuild } from 'rollup';
import type * as d from '../../../declarations';
export declare const generateSystem: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) => Promise<d.UpdatedLazyBuildCtx>;
