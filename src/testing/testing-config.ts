import * as d from '@declarations';
import * as path from 'path';


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
  buildEsm = true;
  flags: d.ConfigFlags = {};
  bundles: d.ConfigBundle[];
  outputTargets: d.OutputTarget[];
  buildEs5: boolean;
  hashFileNames: boolean;
  maxConcurrentWorkers = 1;
  minifyCss: boolean;
  minifyJs: boolean;
  testing: d.TestingConfig;
  validateTypes = false;
  nodeResolve: d.NodeResolveConfig = {
    customResolveOptions: {},
  };
}
