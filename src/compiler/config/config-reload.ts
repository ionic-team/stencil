import * as d from '../../declarations';
import { validateConfig } from './validate-config';


export function configFileReload(config: d.Config, compilerCtx: d.CompilerCtx) {
  try {
    const updatedConfig = config.sys.loadConfigFile(config.configPath);

    configReload(config, updatedConfig);

    // reset the compiler context cache
    compilerCtx.reset();

  } catch (e) {
    config.logger.error(e);
  }
}


export function configReload(config: d.Config, updatedConfig: d.Config) {
  const keepers: any = {};

  // empty it out cuz we're gonna use the same object
  // but don't remove our keepers, we still need them
  for (const key in config) {
    if (CONFIG_RELOAD_KEEPER_KEYS.includes(key)) {
      keepers[key] = (config as any)[key];
    } else {
      delete (config as any)[key];
    }
  }

  // fill it up with the newly loaded config
  // but don't touch our "keepers"
  for (const key in updatedConfig) {
    if (!CONFIG_RELOAD_KEEPER_KEYS.includes(key)) {
      (config as any)[key] = (updatedConfig as any)[key];
    }
  }

  config._isValidated = false;

  // validate our new config data
  validateConfig(config, [], false);

  // ensure we're using the correct original config data
  for (const key in keepers) {
    (config as any)[key] = keepers[key];
  }
}


// stuff that should be constant between config updates
// implementing the Config interface to make sure we're
// using the correct keys, but the value doesn't matter here
const CONFIG_RELOAD_KEEPERS: d.Config = {
  flags: null,
  cwd: null,
  logger: null,
  rootDir: null,
  sys: null,
  watch: null
};

const CONFIG_RELOAD_KEEPER_KEYS = Object.keys(CONFIG_RELOAD_KEEPERS);
