import * as d from '.';


export interface DevServer {
  browserUrl: string;
  close(): Promise<void>;
}


export interface StencilDevServerConfig {
  /**
   * IP address used by the dev server. The default is `0.0.0.0`, which points to all IPv4 addresses on the local machine, such as `localhost`.
   */
  address?: string;
  /**
   * Base path to be used by the server. Defaults to the root pathname.
   */
  basePath?: string;
  /**
   * When `true`, the dev server will use a SSL certificate to run over https. Defaults to `false`.
   */
  https?: boolean;
  /**
   * The URL the dev server should first open to. Defaults to `/`.
   */
  initialLoadUrl?: string;
  /**
   * When `true`, every request to the server will be logged within the terminal. Defaults to `false`.
   */
  logRequests?: boolean;
  /**
   * By default, when dev server is started the local dev URL is opened in your default browser. However, to prevent this URL to be opened change this value to `false`. Defaults to `true`.
   */
  openBrowser?: boolean;
  /**
   * Sets the server's port. Defaults to `3333`.
   */
  port?: number;
  /**
   * When files are watched and udated, by default the dev server will use `hmr` (Hot Module Replacement) to update the page without a full page refresh. To have the page do a full refresh use `pageReload`. To disable any reloading, use `null`. Defaults to `hmr`.
   */
  reloadStrategy?: PageReloadStrategy;
  root?: string;
  websocket?: boolean;
}

export interface DevServerConfig extends StencilDevServerConfig {
  browserUrl?: string;
  contentTypes?: { [ext: string]: string };
  devServerDir?: string;
  editors?: DevServerEditor[];
  excludeHmr?: string[];
  gzip?: boolean;
  historyApiFallback?: HistoryApiFallback;
  openBrowser?: boolean;
  protocol?: 'http' | 'https';
}


export type PageReloadStrategy = 'hmr' | 'pageReload' | null;


export interface DevServerStartResponse {
  browserUrl?: string;
  initialLoadUrl?: string;
}


export interface DevClientWindow extends Window {
  ['s-dev-server']: boolean;
  ['s-initial-load']: boolean;
  WebSocket: new (socketUrl: string, protos: string[]) => WebSocket;
}


export interface DevClientConfig {
  basePath: string;
  editors: d.DevServerEditor[];
  reloadStrategy: PageReloadStrategy;
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
  requestLog?: {
    method: string;
    url: string;
    status: number;
  };
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
