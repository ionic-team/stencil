import { Cache } from '../cache';
import { Config, Diagnostic, StencilSystem } from '../../util/interfaces';
import { InMemoryFileSystem } from '../../util/in-memory-fs';


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
  config: Config;
  sys: StencilSystem;
  fs: InMemoryFileSystem;
  cache: Cache;
  diagnostics: Diagnostic[];
}
