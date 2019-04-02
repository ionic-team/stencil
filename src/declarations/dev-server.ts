import * as d from '.';


export interface DevServer {
  browserUrl: string;
  close(): Promise<void>;
}


export interface DevServerConfig {
  address?: string;
  baseUrl?: string;
  browserUrl?: string;
  contentTypes?: { [ext: string]: string };
  devServerDir?: string;
  editors?: DevServerEditor[];
  excludeHmr?: string[];
  gzip?: boolean;
  historyApiFallback?: HistoryApiFallback;
  hotReplacement?: boolean;
  initialLoadUrl?: string;
  openBrowser?: boolean;
  port?: number;
  protocol?: 'http' | 'https';
  root?: string;
  ssl?: DevServerGetSSL | DevServerSSLConfig;
  websocket?: boolean;
}

export type DevServerGetSSL = () => Promise<DevServerSSLConfig>;

export interface DevServerStartResponse {
  browserUrl?: string;
  initialLoadUrl?: string;
}

export interface DevServerSSLConfig {
  cert?: string | Buffer | Array<string | Buffer>;
  key?: string | Buffer | Array<Buffer | Object>;
}


export interface DevClientWindow extends Window {
  ['s-dev-server']: boolean;
  ['s-initial-load']: boolean;
  WebSocket: new (socketUrl: string, protos: string[]) => WebSocket;
}


export interface DevClientConfig {
  baseUrl: string;
  editors: d.DevServerEditor[];
  hmr: boolean;
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
  host?: string;
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
  'Access-Control-Allow-Origin'?: string;
  'Content-Encoding'?: 'gzip';
  'Vary'?: 'Accept-Encoding';
  'X-Powered-By'?: string;
  'X-Directory-Index'?: string;
}


export interface DevServerEditor {
  id: string;
  name?: string;
  supported?: boolean;
  priority?: number;
}


export interface OpenInEditorData {
  file?: string;
  line?: number;
  column?: number;
  open?: string;
  editor?: string;
  exists?: boolean;
  error?: string;
}
