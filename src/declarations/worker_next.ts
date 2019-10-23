import { CompileOptions, CompileResults, CompilerBuildResults, CompilerWatcher, Config, Diagnostic } from '.';
import { CompilerFsStats, CompilerSystemMakeDirectoryOptions, WatcherCloseResults } from '../internal';


export interface CompilerWorkerContext {
  autoPrefixCss(css: string): Promise<string>;
  build(): Promise<CompilerBuildResults>;
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  createWatcher(): Promise<CompilerWatcher>;
  destroy(): Promise<void>;
  initCompiler(): Promise<void>;
  loadConfig(config?: Config): Promise<Diagnostic[]>;

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
  sendMessage(...args: any[]): Promise<any>;
  destroy(): void;
}

export interface WorkerMsg {
  stencilId?: number;
  inputArgs?: any[];
  rtnValue?: any;
  rtnError?: string;
  rtnEventName?: any;
  rtnEventData?: any;
  terminate?: boolean;
}

export interface CompilerWorkerTask {
  stencilId?: number;
  inputArgs?: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  retries?: number;
}

export type WorkerMsgHandler = (msg: WorkerMsg) => Promise<WorkerMsg>;
