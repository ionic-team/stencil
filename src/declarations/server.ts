import { Config } from './config';
import { Logger } from './logger';


export interface ServerConfigInput {
  app: ExpressApp;
  configPath?: string;
}


export interface ServerConfigOutput {
  config: Config;
  logger: Logger;
  wwwDir: string;
  destroy?: () => void;
}


export interface ExpressApp {
  use?: Function;
}


export interface MiddlewareConfig {
  config: string | Config;
  destroy?: () => void;
}
