import { ChildProcess, ForkOptions } from "child_process";
import { WorkerFarm } from "./main";


export interface WorkerOptions {
  maxConcurrentWorkers?: number;
  maxConcurrentTasksPerWorker?: number;
  maxTaskTime?: number;
  forkOptions?: ForkOptions;
  forcedKillTime?: number;
}

export interface Task {
  taskId?: number;
  methodName: string;
  args: any[];
  isLongRunningTask: boolean;
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  timer?: any;
}

export interface Worker {
  workerId: number;
  taskIds: number;
  send?(msg: MessageData): void;
  kill?(signal?: string): void;
  tasks?: Task[];
  totalTasksAssigned?: number;
  exitCode?: number;
  isExisting?: boolean;
}

export interface MessageData {
  workerId?: number;
  taskId?: number;
  modulePath?: string;
  methodName?: string;
  args?: any[];
  value?: any;
  exitProcess?: boolean;
  error?: {
    type?: string;
    message?: string;
    stack?: string;
  }
}

export type Runner = (methodName: string, args: any[]) => Promise<any>;
