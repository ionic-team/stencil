import { CompileOptions, CompileResults, CompilerBuildResults, CompilerWatcher, Config, Diagnostic, OptimizeCssInput, OptimizeCssOutput } from '.';
import { CompilerFsStats, CompilerSystemMakeDirectoryOptions, WatcherCloseResults } from '../internal';


export interface CompilerWorkerContext {
  autoPrefixCss(css: string): Promise<{output: string, diagnostics: Diagnostic[]}>;
  build(): Promise<CompilerBuildResults>;
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  createWatcher(): Promise<CompilerWatcher>;
  destroy(): Promise<void>;
  initCompiler(): Promise<void>;
  loadConfig(config?: Config): Promise<Diagnostic[]>;
  minifyJs(input: string, opts?: any): Promise<{output: string, sourceMap: any, diagnostics: Diagnostic[]}>;
  optimizeCss(inputOpts: OptimizeCssInput): Promise<OptimizeCssOutput>;
  scopeCss(cssText: string, scopeId: string, commentOriginalSelector: boolean): Promise<string>;

  sysAccess(p: string): Promise<boolean>;
  sysMkdir(p: string, opts?: CompilerSystemMakeDirectoryOptions): Promise<boolean>;
  sysReaddir(p: string): Promise<string[]>;
  sysReadFile(p: string, encoding?: string): Promise<string>;
  sysRmdir(p: string): Promise<boolean>;
  sysStat(p: string): Promise<CompilerFsStats>;
  sysUnlink(p: string): Promise<boolean>;
  sysWriteFile(p: string, content: string): Promise<boolean>;

  watcherClose(): Promise<WatcherCloseResults>;
  watcherStart(): Promise<WatcherCloseResults>;
}

export interface WorkerMainController {
  send(...args: any[]): Promise<any>;
  destroy(): void;
}

export interface MsgToWorker {
  stencilId: number;
  args: any[];
  terminate?: boolean;
}

export interface MsgFromWorker {
  stencilId: number;
  rtnValue: any;
  rtnError: string;
  rtnEventName?: any;
  rtnEventData?: any;
}

export interface CompilerWorkerTask {
  stencilId?: number;
  inputArgs?: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  retries?: number;
}

export type WorkerMsgHandler = (msgToWorker: MsgToWorker) => Promise<any>;
