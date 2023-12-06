import type * as d from '../../declarations';
import { PluginCtx, PluginTransformResults } from '../../declarations';
export declare const runPluginResolveId: (pluginCtx: PluginCtx, importee: string) => Promise<string>;
export declare const runPluginLoad: (pluginCtx: PluginCtx, id: string) => Promise<string>;
export declare const runPluginTransforms: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, id: string, cmp?: d.ComponentCompilerMeta) => Promise<PluginTransformResults | null>;
export declare const runPluginTransformsEsmImports: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, code: string, id: string) => Promise<{
    code: string;
    id: string;
    map: string;
    diagnostics: d.Diagnostic[];
    dependencies: string[];
}>;
