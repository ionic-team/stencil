
export class Config {
  private c: any;

  constructor(config?: any) {
    this.c = config;
  }

  get(key: string, fallback: any = null): any {
    if (key === 'mode') {
      return 'md';
    }
    return fallback;
  }

}
