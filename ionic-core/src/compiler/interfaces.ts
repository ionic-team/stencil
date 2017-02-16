
export interface ComponentItem {
  hasValidComponent?: boolean;
  filePath?: string;
  template?: string;
  transformedTemplate?: string;
  templateUrl?: string;
  templateRender?: string;
  inputComponentDecorator?: string;
  outputComponentDecorator?: string;
  ast?: any;
  staticRenderFns?: any;
  errors?: string[];
}



export interface CompileOptions {

}


export interface CompilerContext {

}
