import * as d from '.';
import {
  LoadHook,
  Plugin as RollupPlugin,
  PluginContext as RollupPluginContext,
  ResolveIdHook,
  TransformHook
} from 'rollup';

export interface Plugin extends RollupPlugin {
  /**
   * Defines a custom loader. Returning `null` defers to other `load` functions (and eventually the default behavior of loading from the file system).
   */
  load?(this: RollupPluginContext, id: string, pluginContext?: PluginCtx): LoadHookReturnType;

  /**
   * Defines a custom resolver. A resolver can be useful for e.g. locating third-party dependencies. Returning `null` defers to other `resolveId` functions and eventually the default resolution behavior; returning `false` signals that source should be treated as an external module and not included in the bundle. If this happens for a relative import, the id will be renormalized the same way as when the `external` option is used.
   */
  resolveId?(
    this: RollupPluginContext,
    importee: string,
    importer: string,
    pluginContext?: PluginCtx,
  ): ResolveIdHookReturnType;

  /**
   * Can be used to transform individual modules.
   */
  transform?(
    this: RollupPluginContext,
    code: string,
    id: string,
    pluginContext?: PluginCtx,
  ): TransformHookReturnType;
}

type LoadHookReturnType = ReturnType<LoadHook>;
type ResolveIdHookReturnType = ReturnType<ResolveIdHook>;
type TransformHookReturnType = ReturnType<TransformHook> | Promise<PluginTransformResults>;

export interface PluginTransformResults {
  code: string;
  id?: string;
}

export interface PluginCtx {
  config: d.Config;
  sys: d.StencilSystem;
  fs: d.InMemoryFileSystem;
  cache: d.Cache;
  diagnostics: d.Diagnostic[];
}
