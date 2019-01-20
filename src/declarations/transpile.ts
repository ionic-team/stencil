import * as d from '.';


export interface TranspileResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: d.Diagnostic[];
  moduleFile: d.Module;
  build: d.Build;
}


export interface ValidateTypesResults {
  diagnostics: d.Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}
