
export interface AppInitOptions {
  config?: any;
  components?: ComponentClass[];
  pages?: PageAsyncMeta[];
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
  template?: string;
  templateUrl?: string;

  /** @deprecated */
  selector?: string;
}


export interface ComponentCompiledMeta extends ComponentMeta {
  render?: any;
  staticRenderFns?: any;
  host?: {[key: string]: string};
}


export interface PropOptionsMeta {
  type?: any;
  required?: boolean;
  default?: any;
  validator?(value: any): boolean;
}


export interface PageAsyncMeta {
  tag: string;
  modulePath: string;
}

