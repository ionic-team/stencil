
export interface StyleCompiler {
  modeName: string;
  styleId: string;
  styleStr: string;
  externalStyles: ExternalStyleCompiler[];
  compiledStyleText: string;
  compiledStyleTextScoped: string;
}


export interface ExternalStyleCompiler {
  absolutePath: string;
  relativePath: string;
  originalComponentPath: string;
  originalCollectionPath: string;
}


export interface ModeStyles {
  [modeName: string]: string | string[];
}


export interface CssImportData {
  srcImport: string;
  updatedImport?: string;
  url: string;
  filePath?: string;
  altFilePath?: string;
  styleText?: string;
}
