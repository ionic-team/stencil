import type * as d from '../declarations';
export declare function createServerContext(sys: d.CompilerSystem, sendMsg: d.DevServerSendMessage, devServerConfig: d.DevServerConfig, buildResultsResolves: BuildRequestResolve[], compilerRequestResolves: CompilerRequestResolve[]): d.DevServerContext;
export interface CompilerRequestResolve {
    path: string;
    resolve: (results: d.CompilerRequestResponse) => void;
    reject: (msg: any) => void;
}
export interface BuildRequestResolve {
    resolve: (results: d.CompilerBuildResults) => void;
    reject: (msg: any) => void;
}
