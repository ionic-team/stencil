import * as d from '.';


export interface Plugin<F extends d.OutputPluginTarget = d.OutputPluginTarget> {
  name?: string;
  load?: (id: string, context?: PluginCtx) => Promise<string> | string;
  resolveId?: (importee: string, importer: string, context?: PluginCtx) => Promise<string> | string;
  transform?: (sourceText: string, id: string, context: PluginCtx) => Promise<PluginTransformResults> | PluginTransformResults;
  validate?: (outputTargets: d.OutputPluginTarget, config: d.Config) => F;
  createOutput?: (outputTargets: F[], config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, docsData: d.JsonDocs) => Promise<void>;
}


export interface PluginTransformResults {
  code?: string;
  id?: string;
}


export interface PluginCtx {
  config: d.Config;
  sys: d.StencilSystem;
  fs: d.InMemoryFileSystem;
  cache: d.Cache;
  diagnostics: d.Diagnostic[];
}
