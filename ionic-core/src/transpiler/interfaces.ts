import * as ts from 'typescript';


export interface TranspileOptions {
  srcDir?: string;
  tsConfigPath?: string;
  debugMode?: boolean;
  cacheFiles?: boolean;
  preserveWhitespace?: boolean;
  writeTranspiledFilesToDisk?: boolean;
}


export interface TranspileContext {
  files?: Map<string, FileMeta>;
  cachedTsProgram?: ts.Program;
  tsConfig?: TsConfig;
  tsCompilerHost?: ts.CompilerHost;
}


export interface FileMeta {
  filePath: string;

  srcText: string;
  srcTransformedText?: string;
  transpileText?: string;

  isTsSourceFile?: boolean;
  isTransformable?: boolean;

  components?: ComponentMeta[];
}


export interface ComponentMeta {
  tag?: string;

  template?: string;
  templateUrl?: string;
  generatedTemplate?: string;

  templateRenderSource?: string;
  templateRenderFn?: string;

  templateStaticRenderFnsSource?: any;
  templateStaticRenderFns?: any;

  errors?: string[];
  templateAst?: any;

  inputComponentDecorator?: string;
  outputComponentDecorator?: string;
}


export interface TsConfig {
  options: ts.CompilerOptions;
  fileNames: string[];
  raw: any;
}

export interface Diagnostic {
  level: string;
  type: string;
  language: string;
  header: string;
  code: string;
  messageText: string;
  absFileName: string;
  relFileName: string;
  lines: PrintLine[];
}


export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text: string;
  errorCharStart: number;
  errorLength: number;
}
