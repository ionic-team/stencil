import * as path from 'path';
import * as d from '../declarations';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';


export class TestingConfig implements d.Config {
  _isTesting = true;
  logger = new TestingLogger();
  sys = new TestingSystem();

  namespace: string;
  rootDir = path.resolve('/');
  cwd = path.resolve('/');
  globalScript: string;
  suppressTypeScriptErrors = true;
  devMode = true;
  enableCache = false;
  buildAppCore = false;
  flags: d.ConfigFlags = {};
  bundles: d.ConfigBundle[];
  outputTargets: d.OutputTarget[];
  buildEs5: boolean;
  hashFileNames: boolean;
  minifyCss: boolean;
  minifyJs: boolean;
}
