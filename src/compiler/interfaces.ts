import * as ts from 'typescript';


export interface CompilerOptions {
  srcDir?: string;
  destDir?: string;
  ionicBundlesDir?: string;
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
  props?: any;
  obsAttrs?: string[];
  hostCss?: string;
  moduleUrl?: string;
  styles?: string;
  styleUrls?: string[];
  modeStyleUrls?: {[mode: string]: string[]};
  preprocessStyles?: string[];
  cloak?: boolean;
  shadow?: boolean;
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
