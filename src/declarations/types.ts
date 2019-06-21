
export interface TypesImportData {
  [key: string]: TypesMemberNameData[];
}


export interface TypesMemberNameData {
  localName: string;
  importName?: string;
}


export interface TypesModule {
  isDep: boolean;
  tagName: string;
  tagNameAsPascal: string;
  htmlElementName: string;
  component: string;
  jsx: string;
  element: string;
}


export type TypeInfo = {
  name: string,
  type: string;
  optional: boolean;
  required: boolean;
  public: boolean;
  jsdoc?: string;
}[];
