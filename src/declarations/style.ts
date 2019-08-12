
export interface StyleCompiler {
  modeName: string;
  styleId: string;
  styleStr: string;
  styleIdentifier: string;
  externalStyles: ExternalStyleCompiler[];
  compiledStyleText: string;
  compiledStyleTextScoped: string;
  compiledStyleTextScopedCommented: string;
}


export interface ExternalStyleCompiler {
  absolutePath: string;
  relativePath: string;
  originalComponentPath: string;
}


export interface CompilerModeStyles {
  [modeName: string]: string[];
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


export interface CssToEsmImportData {
  srcImportText: string;
  varName: string;
  url: string;
  filePath: string;
}
