/// <reference types="node" />
import type { ServerResponse } from 'http';
import type * as d from '../declarations';
export declare function serveOpenInEditor(serverCtx: d.DevServerContext, req: d.HttpRequest, res: ServerResponse): Promise<void>;
export declare function getEditors(): Promise<d.DevServerEditor[]>;
