import { Config } from '@declarations';
import { loadConfig as utilLoadConfig } from '../compiler/config/load-config';


export function loadConfig(configObj: string | Config) {
  const config = utilLoadConfig(configObj);

  return config;
}
