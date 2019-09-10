import { Diagnostic } from './diagnostics';


export interface AssetsMeta {
  absolutePath: string;
  cmpRelativePath: string;
  originalComponentPath: string;
}


export interface CopyTask {
  src: string;
  dest?: string;
  warn?: boolean;
  keepDirStructure?: boolean;
}


export interface CopyResults {
  diagnostics: Diagnostic[];
  filePaths: string[];
  dirPaths: string[];
}
