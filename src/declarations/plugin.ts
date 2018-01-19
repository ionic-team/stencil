import * as d from '../declarations/index';
import { Cache } from '../compiler/cache';
import { InMemoryFileSystem } from '../util/in-memory-fs';


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
  fs: InMemoryFileSystem;
  cache: Cache;
  diagnostics: d.Diagnostic[];
}
