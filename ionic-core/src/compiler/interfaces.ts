

export interface FileMeta {
  inputFilePath?: string;
  outputFilePath?: string;

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
  writeToDisk?: boolean;
}


export interface CompilerContext {

}
