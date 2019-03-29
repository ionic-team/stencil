
export interface TypesImportData {
  [key: string]: TypesMemberNameData[];
}


export interface TypesMemberNameData {
  localName: string;
  importName?: string;
}


export interface TypesModule {
  isDep: boolean;
  tagNameAsPascal: string;
  component: string;
  jsx: string;
  element: string;

  HTMLElementTagNameMap: string;
  ElementTagNameMap: string;
}


export type TypeInfo = {
  name: string,
  type: string;
  optional: boolean;
  required: boolean;
  public: boolean;
  jsdoc?: string;
}[];
