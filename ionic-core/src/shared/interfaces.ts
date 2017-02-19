
export interface AppInitOptions {
  rootSelector?: string;
  config?: any;
  components?: ComponentClass[];
  routes?: any;
}


export interface ComponentClass {
  new (arg0?: any): ComponentInstance;
}


export abstract class ComponentInstance {
  abstract ionViewDidLoad?(): void;
  abstract ionViewWillEnter?(): void;
  abstract ionViewDidEnter?(): void;
  abstract ionViewWillLeave?(): void;
  abstract ionViewDidLeave?(): void;
  abstract ionViewCanEnter?(): void;
  abstract ionViewCanLeave?(): void;
  abstract ionViewWillUnload?(): void;
}


export interface ComponentMeta {
  tag?: string;

  /** @deprecated */
  selector?: string;

  template?: string;
  templateUrl?: string;

  // will only be in ComponentCompiledMeta
  props?: { [key: string]: PropOptions };
  computed?: { [key: string]: ComputedOptions };
  methods?: { [key: string]: Function };
  render?: any;
  staticRenderFns?: any;
  inputs?: string[];
  outputs?: string[];
  host?: {[key: string]: string};
}


export interface ComponentCompiledMeta extends ComponentMeta {
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


export interface InputMeta {
}


export interface OutputMeta {
}
