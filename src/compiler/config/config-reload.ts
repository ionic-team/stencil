import { CompilerCtx, Config } from '../../declarations';
import { resetCompilerCtx } from '../build/compiler-ctx';
import { validateConfig } from './validate-config';


export function configFileReload(config: Config, compilerCtx: CompilerCtx) {
  config.logger.debug(`reload config file: ${config.configPath}`);

  try {
    const updatedConfig = config.sys.loadConfigFile(config.configPath);

    // empty it out cuz we're gonna use the same object
    // but don't remove our keepers, we still need them
    for (const key in config) {
      if (!CONFIG_RELOAD_KEEPER_KEYS.includes(key)) {
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

    // validate our new config data
    validateConfig(config);

    // reset the compiler context cache
    resetCompilerCtx(compilerCtx);

  } catch (e) {
    config.logger.error(e);
  }
}

// stuff that should be constant between config updates
// implementing the Config interface to make sure we're
// using the correct keys, but the value doesn't matter here
const CONFIG_RELOAD_KEEPERS: Config = {
  sys: null,
  logger: null,
  cwd: null,
  devMode: null,
  watch: null,
  outputTargets: null
};

const CONFIG_RELOAD_KEEPER_KEYS = Object.keys(CONFIG_RELOAD_KEEPERS);
