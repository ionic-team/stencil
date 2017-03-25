import * as ts from 'typescript';


export interface CompilerOptions {
  srcDir?: string;
  destDir?: string;
  ionicCoreDir?: string;
  ionicThemesDir?: string;
  scriptTarget?: 'es5' | 'es2015';
  module?: 'common' | 'es2015' | 'umd';
  sassOutputStyle?: 'expanded' | 'compressed';
  debugMode?: boolean;
  cacheFiles?: boolean;
}


export interface CompilerContext {
  files?: Map<string, FileMeta>;
  cachedTsProgram?: ts.Program;
  tsCompilerHost?: ts.CompilerHost;
  components?: ComponentMeta[];
}


export interface FileMeta {
  fileName: string;
  filePath: string;

  srcText: string;
  srcTextWithoutDecorators: string;
  transpiledText?: string;

  isTsSourceFile: boolean;
  isTransformable: boolean;

  cmpMeta?: ComponentMeta;
}


export interface PropOptions {
  type?: 'string' | 'boolean' | 'number' | 'Array' | 'Object';
}


export interface Props {
  [propName: string]: PropOptions;
}


export interface ComponentMeta {
  tag?: string;
  props?: Props;
  observedAttributes?: string[];
  hostCss?: string;
  modes: {[mode: string]: ComponentMode};
}


export interface ComponentMode {
  styles?: string;
  styleUrls?: string[];
  hash?: string;
  id?: string;
  fileName?: string;
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
