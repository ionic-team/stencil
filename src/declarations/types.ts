
export interface TypesImportData {
  [key: string]: TypesMemberNameData[];
}


export interface TypesMemberNameData {
  localName: string;
  importName?: string;
}


export interface TypesModule {
  tagNameAsPascal: string;
  StencilComponents: string;
  JSXElements: string;
  global: string;
  HTMLElementTagNameMap: string;
  ElementTagNameMap: string;
  IntrinsicElements: string;
}


export interface TypeInfo {
  [key: string]: {
    type: string;
    optional: boolean;
    required: boolean;
    public: boolean;
    jsdoc?: string;
  };
}
