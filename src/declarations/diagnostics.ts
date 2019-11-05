

export interface Diagnostic {
  level: 'error'|'warn'|'info'|'log'|'debug';
  type: string; // 'typescript'|'bundling'|'build'|'runtime'|'hydrate'|'css'|'config'
  header?: string;
  language?: string;
  messageText: string;
  debugText?: string;
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  lines?: PrintLine[];
}

export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  errorCharStart: number;
  errorLength?: number;
}
