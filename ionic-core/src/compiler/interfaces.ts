

export interface FileMeta {
  inputFilePath?: string;
  outputFilePath?: string;
  sourceFileDirPath?: string;
  ext?: string;

  inputSourceText?: string;
  outputSourceText?: string;

  components?: ComponentMeta[];
}


export interface ComponentMeta {
  selector?: string;

  template?: string;
  templateUrl?: string;
  transformedTemplate?: string;

  templateRenderSource?: string;
  templateRenderFn?: string;

  templateStaticRenderFnsSource?: any;
  templateStaticRenderFns?: any;

  errors?: string[];
  templateAst?: any;

  inputComponentDecorator?: string;
  outputComponentDecorator?: string;
}


export interface CompileOptions {
  inputDir?: string;
  sourceFileDir?: string;
  writeToDisk?: boolean;
  preserveWhitespace?: boolean;
  warn?: Function;
  cacheFiles?: boolean;
}


export interface CompilerContext {
  files?: Map<string, string>;
}

