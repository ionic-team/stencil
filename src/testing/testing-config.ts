import { Config } from '../declarations';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';


export class TestingConfig implements Config {
  logger = new TestingLogger();
  sys = new TestingSystem();

  rootDir = '/';
  suppressTypeScriptErrors = true;
  devMode = true;
  enableCache = false;
  buildAppCore = false;
  flags = {};
}
