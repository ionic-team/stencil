import * as d from '.';


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


export interface DevServerMessage {
  startServer?: DevServerConfig;
  serverStated?: DevServerStartResponse;
  buildLog?: d.BuildLog;
  buildResults?: d.BuildResults;
  requestBuildResults?: boolean;
  error?: { message?: string; type?: string; stack?: any; };
  isActivelyBuilding?: boolean;
}


export type DevServerDestroy = () => void;


export interface DevResponseHeaders {
  'Cache-Control'?: string;
  'Expires'?: string;
  'Content-Type'?: string;
  'Content-Length'?: number;
  'X-Powered-By'?: string;
}
