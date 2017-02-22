

export class Config {

  constructor(config?: any) {
    config;
  }

  get(key: string, fallback?: null) {
    if (key === 'mode') {
      return 'md';
    }
    return fallback;
  }

}
