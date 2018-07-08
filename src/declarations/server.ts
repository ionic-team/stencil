import * as d from '.';


export interface ServerConfigInput {
  app: ExpressApp;
  configPath?: string;
}


export interface ServerConfigOutput {
  config: d.Config;
  logger: d.Logger;
  wwwDir: string;
  destroy?: () => void;
}


export interface ExpressApp {
  use?: Function;
}


export interface MiddlewareConfig {
  config: string | d.Config;
  destroy?: () => void;
}
