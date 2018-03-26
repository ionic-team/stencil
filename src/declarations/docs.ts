

export interface JsonDocs {
  components: JsonDocsComponent[];
}


export interface JsonDocsComponent {
  tag?: string;
  readme?: string;
  props?: JsonDocsProp[];
  methods?: JsonDocsMethod[];
  events?: JsonDocsEvent[];
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
}


export interface JsonDocsEvent {
  event: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  docs?: string;
}
