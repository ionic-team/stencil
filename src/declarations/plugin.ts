import * as d from './index';


export interface Plugin {
  load?: (id: string, context?: PluginCtx) => Promise<string>;
  name: string;
  resolveId?: (importee: string, importer: string, context?: PluginCtx) => Promise<string>;
  transform?: (sourceText: string, id?: string, context?: PluginCtx) => Promise<PluginTransformResults>;
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
