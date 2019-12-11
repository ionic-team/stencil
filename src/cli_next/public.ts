
import {
  CompilerSystem,
  Config,
  ConfigFlags,
  Logger,
  TaskCommand,
} from '@stencil/core/internal';

export declare function createNodeLogger(process: any): Logger;
export declare function createNodeSystem(process: any): CompilerSystem;
export declare function parseFlags(args: string[]): ConfigFlags;
export declare function run(init: CliInitOptions): Promise<void>;
export interface CliInitOptions {
    process?: any;
    logger?: Logger;
    sys?: CompilerSystem;
}
export declare function runTask(process: any, config: Config, task: TaskCommand): Promise<void>;
export {
  CompilerSystem,
  Config,
  ConfigFlags,
  Logger,
  TaskCommand,
};

