import { Cache } from './cache';
import { Config } from './config';
import { Diagnostic } from './diagnostics';
import { InMemoryFileSystem } from './in-memory-fs';
import { StencilSystem } from './system';


export interface Plugin {
  name?: string;
  pluginType?: string;
  load?: (id: string, context: PluginCtx) => Promise<string> | string;
  resolveId?: (importee: string, importer: string, context: PluginCtx) => Promise<string> | string;
  transform?: (sourceText: string, id: string, context: PluginCtx) => Promise<PluginTransformResults> | PluginTransformResults | string;
}

export interface PluginTransformResults {
  code?: string;
  map?: string;
  id?: string;
  diagnostics?: Diagnostic[];
  dependencies?: string[];
}

export interface PluginCtx {
  config: Config;
  sys: StencilSystem;
  fs: InMemoryFileSystem;
  cache: Cache;
  diagnostics: Diagnostic[];
}
