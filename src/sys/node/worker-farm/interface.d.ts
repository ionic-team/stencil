import { ChildProcess, ForkOptions } from "child_process";
import { WorkerFarm } from "./main";


export interface WorkerOptions {
  maxConcurrentWorkers?: number;
  maxConcurrentCallsPerWorker?: number;
  maxCallTime?: number;
  forkOptions?: ForkOptions;
  forcedKillTime?: number;
}

export interface CallItem {
  callId?: number;
  methodName: string;
  args: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  timer?: any;
}

export interface Worker {
  workerId: number;
  callIds: number;
  send(msg: MessageData): void;
  kill(signal?: string): void;
  calls?: CallItem[];
  callsAssigned?: number;
  exitCode?: number;
  isExisting?: boolean;
}

export interface MessageData {
  callId?: number;
  modulePath?: string;
  methodName?: string;
  args?: any[];
  returnedValue?: any;
  exitProcess?: boolean;
  workerId?: number;
  error?: {
    type?: string;
    message?: string;
    stack?: string;
  }
}
