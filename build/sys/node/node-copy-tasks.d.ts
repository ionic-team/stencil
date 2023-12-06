import type * as d from '../../declarations';
export declare function nodeCopyTasks(copyTasks: Required<d.CopyTask>[], srcDir: string): Promise<d.CopyResults>;
export declare function asyncGlob(pattern: string, opts: any): Promise<string[]>;
