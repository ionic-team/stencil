import * as d from '.';


export interface DocsData {
  components: DocsDataComponent[];
}


export interface DocsDataComponent {
  dirPath: string;
  fileName: string;
  filePath: string;
  readmePath: string;
  usagesDir: string;
  moduleFile: d.ModuleFile;
  cmpMeta: d.ComponentMeta;
}


export interface ApiDocs {
  components: ApiDocsComponent[];
}


export interface ApiDocsComponent {
  tag?: string;
  props?: ApiDocsProp[];
  methods?: ApiDocsMethod[];
  events?: ApiDocsEvent[];
  styles?: ApiDocsStyle[];
}


export interface ApiDocsProp {
  name?: string;
  type?: string;
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
}


export interface ApiDocsMethod {
  name: string;
  returns?: JsonDocsMethodReturn;
  parameters?: JsonDocMethodParameter[];
}


export interface ApiDocsEvent {
  event: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: string;
}


export interface ApiDocsStyle {
  name: string;
  annotation?: string;
}


export interface JsonDocs {
  components: JsonDocsComponent[];
  timestamp: string;
  compiler: {
    name: string;
    version: string;
    typescriptVersion: string;
  };
}


export interface JsonDocsComponent {
  tag?: string;
  readme?: string;
  docs?: string;
  usage?: JsonDocsUsage;
  props?: JsonDocsProp[];
  methods?: JsonDocsMethod[];
  events?: JsonDocsEvent[];
  styles?: JsonDocsStyle[];
}


export interface JsonDocsUsage {
  [key: string]: string;
}


export interface JsonDocsProp {
  name?: string;
  type?: string;
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
  docs?: string;
}


export interface JsonDocsMethod {
  name: string;
  docs?: string;
  returns?: JsonDocsMethodReturn;
  parameters?: JsonDocMethodParameter[];
}

export interface JsonDocsMethodReturn {
  type?: string;
  docs?: string;
}

export interface JsonDocMethodParameter {
  name?: string;
  type?: string;
  docs?: string;
}

export interface JsonDocsEvent {
  event: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  docs?: string;
  detail?: string;
}


export interface JsonDocsStyle {
  name: string;
  docs?: string;
  annotation?: string;
}
