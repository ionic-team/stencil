/// <reference types="node" />
/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
import type * as d from '../declarations';
export declare function createHttpServer(devServerConfig: d.DevServerConfig, serverCtx: d.DevServerContext): https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export declare function findClosestOpenPort(host: string, port: number): Promise<number>;
