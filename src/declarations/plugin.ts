import * as d from '.';


export interface Plugin {
  load?: (id: string, context?: PluginCtx) => Promise<string> | string;
  name?: string;
  resolveId?: (importee: string, importer: string, context?: PluginCtx) => Promise<string> | string;
  transform?: (sourceText: string, id: string, context: PluginCtx) => Promise<PluginTransformResults> | PluginTransformResults;
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
