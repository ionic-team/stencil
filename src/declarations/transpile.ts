import * as d from '.';


export interface TranspileResults {
  sourceFilePath?: string;
  code?: string;
  map?: any;
  diagnostics?: d.Diagnostic[];
  moduleFile?: d.Module;
  cmpMeta?: d.ComponentCompilerMeta;
}


export interface ValidateTypesResults {
  diagnostics: d.Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}
