import { ConfigApi } from '../utils/interfaces';


export function ConfigController(config: any): ConfigApi {

  // TODO
  function get(key: string, fallback = null) {
    if (key === 'mode') {
      return 'md';
    }

    if (config[key]) {
      return config[key];
    }

    return fallback;
  }

  return {
    get: get
  };
}
