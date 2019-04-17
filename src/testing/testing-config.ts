import * as d from '../declarations';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';
import path from 'path';


export class TestingConfig implements d.Config {
  _isTesting = true;

  namespace: string;
  rootDir = path.resolve('/');
  cwd = path.resolve('/');
  globalScript: string;
  devMode = true;
  enableCache = false;
  buildAppCore = false;
  buildScoped = true;
  buildDist = true;
  flags: d.ConfigFlags = {};
  bundles: d.ConfigBundle[];
  outputTargets: d.OutputTarget[];
  buildEs5: boolean;
  hashFileNames: boolean;
  logger = new TestingLogger();
  maxConcurrentWorkers = 1;
  minifyCss: boolean;
  minifyJs: boolean;
  sys = new TestingSystem();
  testing: d.TestingConfig;
  validateTypes = false;
  nodeResolve: d.NodeResolveConfig = {
    customResolveOptions: {},
  };
}
