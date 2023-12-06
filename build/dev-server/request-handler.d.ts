import type { IncomingMessage, ServerResponse } from 'http';
import type * as d from '../declarations';
export declare function createRequestHandler(devServerConfig: d.DevServerConfig, serverCtx: d.DevServerContext): (incomingReq: IncomingMessage, res: ServerResponse) => Promise<void>;
export declare function isValidUrlBasePath(basePath: string, url: URL): boolean;
export declare function isValidHistoryApi(devServerConfig: d.DevServerConfig, req: d.HttpRequest): boolean;
