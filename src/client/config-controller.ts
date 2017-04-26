import { ConfigApi, PlatformConfig } from '../util/interfaces';


export function ConfigController(configObj: any, platforms: PlatformConfig[]): ConfigApi {
  configObj = configObj || {};

  function get(key: string, fallback: any = null): any {
    if (configObj[key] !== undefined) {
      return configObj[key];
    }

    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i]['settings'][key] !== undefined) {
        return platforms[i]['settings'][key];
      }
    }

    return fallback;
  }

  function getBoolean(key: string, fallbackValue: boolean = false): boolean {
    const val = get(key);
    if (val === null) {
      return fallbackValue;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  function getNumber(key: string, fallbackValue: number = NaN): number {
    const val = parseFloat(get(key));
    return isNaN(val) ? fallbackValue : val;
  }

  return {
    get: get,
    getBoolean: getBoolean,
    getNumber: getNumber
  };
}
