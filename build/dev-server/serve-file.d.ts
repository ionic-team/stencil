/// <reference types="node" />
import type { ServerResponse } from 'http';
import type * as d from '../declarations';
export declare function serveFile(devServerConfig: d.DevServerConfig, serverCtx: d.DevServerContext, req: d.HttpRequest, res: ServerResponse): Promise<void>;
export declare function appendDevServerClientScript(devServerConfig: d.DevServerConfig, req: d.HttpRequest, content: string): string;
export declare function appendDevServerClientIframe(content: string, iframe: string): string;
