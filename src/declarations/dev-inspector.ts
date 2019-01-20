import * as d from '.';


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
  tag: string;
  bundle: string | d.ModeBundleIds;
  encapsulation: d.Encapsulation;
  props: DevInspectorPropMeta[];
  states: DevInspectorStateMeta[];
  elements: DevInspectorElementMeta[];
  methods: DevInspectorMethodMeta[];
  events: {
    emmiters: DevInspectorEmmiterMeta[];
    listeners: DevInspectorListenerMeta[];
  };
}


export interface DevInspectorPropMeta {
  name: string;
  type: string;
  connect: string;
  context: string;
  mutable: false;
  watchers: string[];
}


export interface DevInspectorStateMeta {
  name: string;
  watchers: string[];
}


export interface DevInspectorElementMeta {
  name: string;
}


export interface DevInspectorMethodMeta {
  name: string;
}


export interface DevInspectorMembersMap {
  props: DevInspectorPropMeta[];
  states: DevInspectorStateMeta[];
  elements: DevInspectorElementMeta[];
  methods: DevInspectorMethodMeta[];
}


export interface DevInspectorListenerMeta {
  event: string;
  capture: boolean;
  disabled: boolean;
  passive: boolean;
  method: string;
}


export interface DevInspectorEmmiterMeta {
  name: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  method: string;
}
