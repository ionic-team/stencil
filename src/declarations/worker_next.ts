import { CompileOptions, CompileResults, Diagnostic, OptimizeCssInput, OptimizeCssOutput } from '.';
import { TransformCssToEsmInput, TransformCssToEsmOutput, TranspileResults } from '../internal';


export interface CompilerWorkerContext {
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  minifyJs(input: string, opts?: any): Promise<{output: string, sourceMap: any, diagnostics: Diagnostic[]}>;
  optimizeCss(inputOpts: OptimizeCssInput): Promise<OptimizeCssOutput>;
  transformCssToEsm(input: TransformCssToEsmInput): Promise<TransformCssToEsmOutput>;
  transpileToEs5(input: string, inlineHelpers: boolean): Promise<TranspileResults>;
  prepareModule(input: string, minifyOpts: any, transpile: boolean, inlineHelpers: boolean): Promise<{output: string, sourceMap: any, diagnostics: Diagnostic[]}>;
}

export interface WorkerMainController {
  send(...args: any[]): Promise<any>;
  handler(name: string): ((...args: any[]) => Promise<any>);
  destroy(): void;
}

export interface MsgToWorker {
  stencilId: number;
  args: any[];
  terminate?: boolean;
}

export interface MsgFromWorker {
  stencilId?: number;
  rtnValue: any;
  rtnError: string;
}

export interface CompilerWorkerTask {
  stencilId?: number;
  inputArgs?: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  retries?: number;
}

export type WorkerMsgHandler = (msgToWorker: MsgToWorker) => Promise<any>;
