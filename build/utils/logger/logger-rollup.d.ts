import type { RollupError } from 'rollup';
import type * as d from '../../declarations';
export declare const loadRollupDiagnostics: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupError: RollupError) => void;
export declare const createOnWarnFn: (diagnostics: d.Diagnostic[], bundleModulesFiles?: d.Module[]) => (warning: {
    code?: string;
    importer?: string;
    message?: string;
}) => void;
