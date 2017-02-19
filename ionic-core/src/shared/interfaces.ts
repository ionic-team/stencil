

export interface AppInitOptions {
  rootSelector?: string;
  config?: any;
  components?: ComponentClass[];
  routes?: any;
}

export interface ComponentClass {
  new (arg0?: any): any;
}

export interface ComponentInstance {}

export interface ComponentMeta {
  selector?: string;
  template?: string;
  templateUrl?: string;

  // will only be in ComponentCompiledMeta
  props?: { [key: string]: PropOptions };
  computed?: { [key: string]: ComputedOptions };
  methods?: { [key: string]: Function };
  // watch?: { [key: string]: ({ handler: WatchHandler<V> } & WatchOptions) | WatchHandler<V> | string };

  render?: any;
  staticRenderFns?: any;
  inputs?: string[];
  outputs?: string[];
  host?: {[key: string]: string};
}

export interface PropOptions {
  type?: any;
  required?: boolean;
  default?: any;
  validator?(value: any): boolean;
}

export interface ComputedOptions {
  get?(): any;
  set?(value: any): void;
  cache?: boolean;
}

export interface ComponentCompiledMeta extends ComponentMeta {
}

export interface InputMeta {
}

export interface OutputMeta {
}
