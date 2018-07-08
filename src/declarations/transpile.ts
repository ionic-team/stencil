import * as d from '.';


export interface TranspileResults {
  sourceFilePath?: string;
  code?: string;
  map?: any;
  diagnostics?: d.Diagnostic[];
  cmpMeta?: d.ComponentMeta;
}


export interface ValidateTypesResults {
  diagnostics: d.Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}
