

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
  dirPath?: string;
  fileName?: string;
  filePath?: string;
  readmePath?: string;
  usagesDir?: string;

  tag: string;
  readme: string;
  docs: string;
  usage: JsonDocsUsage;
  props: JsonDocsProp[];
  methods: JsonDocsMethod[];
  events: JsonDocsEvent[];
  styles: JsonDocsStyle[];
}

export interface JsonDocsUsage {
  [key: string]: string;
}


export interface JsonDocsProp {
  name: string;
  type: string;
  mutable: boolean;
  attr: string | undefined;
  reflectToAttr: boolean;
  docs: string;
  default: string;

  optional: boolean;
  required: boolean;
}


export interface JsonDocsMethod {
  name: string;
  docs: string;
  signature: string;
  returns: JsonDocsMethodReturn;
  parameters: JsonDocMethodParameter[];
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
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  docs: string;
  detail: string;
}


export interface JsonDocsStyle {
  name: string;
  docs: string;
  annotation: string;
}
