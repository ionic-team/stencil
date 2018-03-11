import { Config, ConfigBundle, ConfigFlags, OutputTarget } from '../declarations';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';


export class TestingConfig implements Config {
  logger = new TestingLogger();
  sys = new TestingSystem();

  namespace: string;
  rootDir = '/';
  suppressTypeScriptErrors = true;
  devMode = true;
  enableCache = false;
  buildAppCore = false;
  flags: ConfigFlags = {};
  bundles: ConfigBundle[];
  outputTargets: OutputTarget[];
}
