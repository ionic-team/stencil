/// <reference types="node" />
import type { Server } from 'http';
import type * as d from '../declarations';
export declare function createWebSocket(httpServer: Server, onMessageFromClient: (msg: d.DevServerMessage) => void): DevWebSocket;
export interface DevWebSocket {
    sendToBrowser: (msg: d.DevServerMessage) => void;
    close: () => Promise<void>;
}
