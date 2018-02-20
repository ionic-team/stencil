import * as d from './index';


export interface DevInspector {
  apps: DevInspectorApp[];
  getInstance: (elm: Element) => Promise<DevInspectorComponentData>;
  getComponent: (tagName: string) => Promise<DevInspectorComponentMeta>;
  getComponents: () => Promise<DevInspectorComponentMeta[]>;
}


export interface DevInspectorApp {
  namespace: string;
  getInstance: (elm: Element) => Promise<DevInspectorComponentData>;
  getComponent: (tagName: string) => Promise<DevInspectorComponentMeta>;
  getComponents: () => Promise<DevInspectorComponentMeta[]>;
}


export interface DevInspectorComponentData {
  meta: DevInspectorComponentMeta;
  instance: any;
}


export interface DevInspectorComponentMeta {
  is?: string;
  properties?: d.ComponentConstructorProperties;
  events?: d.ComponentConstructorEvent[];
  encapsulation?: d.Encapsulation;
}
