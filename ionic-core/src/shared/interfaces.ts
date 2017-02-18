

export interface AppInitOptions {
  el?: string;
  config?: any;
  components?: ComponentClass[];
  routes?: any;
}

export type ComponentClass = Function;
