

export interface Diagnostic {
  level: 'error'|'warn'|'info'|'log'|'debug';
  type: 'typescript'|'bundling'|'build'|'runtime'|'hydrate'|'css';
  header?: string;
  language?: 'javascript'|'typescript'|'scss'|'css';
  messageText: string;
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
