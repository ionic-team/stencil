import * as d from '.';

export interface AssetsMeta {
  absolutePath: string;
  cmpRelativePath: string;
  originalComponentPath: string;
}


export interface CopyTask {
  src: string;
  dest?: string;
  warn?: boolean;
}


export interface CopyResults {
  diagnostics: d.Diagnostic[];
  filePaths: string[];
  dirPaths: string[];
}
