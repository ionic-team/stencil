

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
  templateStaticRenderFns?: any;

  templateErrors?: string[];
  templateAst?: any;

  inputComponentDecorator?: string;
  outputComponentDecorator?: string;
}


export interface CompileOptions {
  inputDir: string;
  sourceFileDir?: string;
  writeToDisk?: boolean;
}


export interface CompilerContext {

}

