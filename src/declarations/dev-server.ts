import * as d from './index';


export interface DevServerConfig {
  address?: string;
  browserUrl?: string;
  contentTypes?: { [ext: string]: string };
  devServerDir?: string;
  excludeHmr?: string[];
  gzip?: boolean;
  historyApiFallback?: HistoryApiFallback;
  hotReplacement?: boolean;
  initialLoadUrl?: string;
  openBrowser?: boolean;
  port?: number;
  protocol?: 'http' | 'https';
  root?: string;
}


export interface DevServerStartResponse {
  browserUrl?: string;
  initialLoadUrl?: string;
}


export interface DevClientWindow extends Window {
  ['s-dev-server']: boolean;
  ['s-initial-load']: boolean;
  WebSocket: new (socketUrl: string, protos: string[]) => WebSocket;
}


export interface HistoryApiFallback {
  index?: string;
  disableDotRule?: boolean;
}


export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  acceptHeader: string;
  url: string;
  pathname?: string;
  filePath?: string;
  stats?: d.FsStats;
  headers?: {[name: string]: string};
}


export interface DevServerSocketConstructor {
  isWebSocket: (req: any) => boolean;
  new (request: any, socket: any, body: any, protos: string[]): DevServerSocket;
}


export interface DevServerSocket {
  on: (type: string, cb: (event: { data: string; }) => void) => void;
  send: (msg: string) => void;
  close: (code: number) => void;
}


export interface DevServerMessage {
  startServer?: DevServerConfig;
  serverStated?: DevServerStartResponse;
  buildResults?: d.BuildResults;
  requestBuildResults?: boolean;
  error?: { message?: string; type?: string; stack?: any; };
}

export interface DevServerContext {
  httpServer: any;
  wsConnections: d.DevServerSocket[];
}
