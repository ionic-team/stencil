import type * as d from '../../declarations';
export type CoreCompiler = typeof import('@stencil/core/compiler');

export interface StencilCLIConfigArgs {
  task?: string;
  args: string[];
  logger: d.Logger;
  sys: d.CompilerSystem;
  flags?: d.ConfigFlags;
  coreCompiler?: CoreCompiler;
  validatedConfig?: d.LoadConfigResults;
}

export default class StencilCLIConfig {
  static instance: StencilCLIConfig;

  private _args: string[];
  private _logger: d.Logger;
  private _sys: d.CompilerSystem;
  private _flags: d.ConfigFlags | undefined;
  private _task: string | undefined;
  private _coreCompiler: CoreCompiler | undefined;
  private _validatedConfig: d.LoadConfigResults | undefined;

  private constructor(options: StencilCLIConfigArgs) {
    this._args = options?.args || [];
    this._logger = options?.logger;
    this._sys = options?.sys;
    this._flags = options?.flags || undefined;
    this._validatedConfig = options?.validatedConfig || undefined;
  }

  public static getInstance(options?: StencilCLIConfigArgs): StencilCLIConfig {
    if (!StencilCLIConfig.instance) {
      StencilCLIConfig.instance = new StencilCLIConfig(options);
    }

    return StencilCLIConfig.instance;
  }

  public resetInstance() {
    delete StencilCLIConfig.instance;
  }

  public get logger() {
    return this._logger;
  }
  public set logger(logger: d.Logger) {
    this._logger = logger;
  }

  public get sys() {
    return this._sys;
  }
  public set sys(sys: d.CompilerSystem) {
    this._sys = sys;
  }

  public get args() {
    return this._args;
  }
  public set args(args: string[]) {
    this._args = args;
  }

  public get task() {
    return this._task;
  }
  public set task(task: string) {
    this._task = task;
  }

  public get flags() {
    return this._flags;
  }
  public set flags(flags: d.ConfigFlags) {
    this._flags = flags;
  }

  public get coreCompiler() {
    return this._coreCompiler;
  }
  public set coreCompiler(coreCompiler: CoreCompiler) {
    this._coreCompiler = coreCompiler;
  }

  public get validatedConfig() {
    return this._validatedConfig;
  }
  public set validatedConfig(validatedConfig: d.LoadConfigResults) {
    this._validatedConfig = validatedConfig;
  }
}

export function initializeStencilCLIConfig(options: StencilCLIConfigArgs): StencilCLIConfig {
  return StencilCLIConfig.getInstance(options);
}

export function getStencilCLIConfig(): StencilCLIConfig {
  return StencilCLIConfig.getInstance();
}

export function getCompilerSystem(): d.CompilerSystem {
  return getStencilCLIConfig().sys;
}

export function getLogger(): d.Logger {
  return getStencilCLIConfig().logger;
}

export function getCoreCompiler(): CoreCompiler {
  return getStencilCLIConfig().coreCompiler;
}
