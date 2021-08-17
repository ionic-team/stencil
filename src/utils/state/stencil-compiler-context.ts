import { CompilerContext } from '../../compiler/build/compiler-ctx';

interface StencilCompilerContextArgs {
  compilerCtx: CompilerContext;
}

export default class StencilCompilerContext {
  static instance: StencilCompilerContext;

  private _compilerCtx: CompilerContext;

  private constructor(options: StencilCompilerContextArgs) {
    this._compilerCtx = options?.compilerCtx ?? new CompilerContext();
  }

  public static getInstance(options?: StencilCompilerContextArgs): StencilCompilerContext {
    if (!StencilCompilerContext.instance) {
      StencilCompilerContext.instance = new StencilCompilerContext(options);
    }

    return StencilCompilerContext.instance;
  }

  public resetInstance() {
    delete StencilCompilerContext.instance;
  }

  public get compilerCtx() {
    return this._compilerCtx;
  }
  public set compilerCtx(compilerCtx: CompilerContext) {
    this._compilerCtx = compilerCtx;
  }
}

export function initializeStencilCompilerContext(options: StencilCompilerContextArgs): StencilCompilerContext {
  return StencilCompilerContext.getInstance(options);
}

export function getStencilCompilerContext(): CompilerContext {
  return StencilCompilerContext.getInstance().compilerCtx;
}
