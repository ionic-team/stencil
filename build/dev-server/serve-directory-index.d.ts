/// <reference types="node" />
import type { ServerResponse } from 'http';
import type * as d from '../declarations';
export declare function serveDirectoryIndex(devServerConfig: d.DevServerConfig, serverCtx: d.DevServerContext, req: d.HttpRequest, res: ServerResponse): Promise<void>;
