

export interface StylesMeta {
  [modeName: string]: StyleMeta;
}


export interface StyleMeta {
  styleId?: string;
  styleStr?: string;
  externalStyles?: ExternalStyleMeta[];
  compiledStyleText?: string;
  compiledStyleTextScoped?: string;
}


export interface ExternalStyleMeta {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
  originalCollectionPath?: string;
}


export interface ModeStyles {
  [modeName: string]: string | string[];
}


export interface CssImportData {
  srcImport: string;
  updatedImport?: string;
  url: string;
  filePath?: string;
  styleText?: string;
}
