

export interface AppInitOptions {
  rootSelector?: string;
  config?: any;
  components?: ComponentClass[];
  routes?: any;
}

export interface ComponentClass {
  new (arg0?: any): any;
}
