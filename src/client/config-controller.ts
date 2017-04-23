import { ConfigApi } from '../util/interfaces';


export function ConfigController(config: any = {}): ConfigApi {

  // TODO
  function get(key: string, fallback: any = null): any {
    if (key === 'mode') {
      return 'md';
    }

    if (config[key]) {
      return config[key];
    }

    return fallback;
  }

  function getBoolean(key: string, fallback: boolean = false): boolean {
    if (config[key] !== undefined) {
      return !!config[key];
    }

    return fallback;
  }

  function getNumber(key: string, fallback: number = NaN): number {
    if (config[key] !== undefined) {
      return config[key];
    }

    return fallback;
  }

  return {
    get: get,
    getBoolean: getBoolean,
    getNumber: getNumber
  };
}
