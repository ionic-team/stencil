export * from '../util/interfaces';
import { ComponentMeta, Diagnostic, Manifest, LoadComponentRegistry } from '../util/interfaces';


export interface BundlerConfig {
  attrCase?: number;
  manifest: Manifest;
}


export interface ModuleFileMeta {
  tsFilePath?: string;
  tsText?: string;
  jsFilePath?: string;
  jsText?: string;
  hasCmpClass?: boolean;
  cmpMeta?: ComponentMeta;
  cmpClassName?: string;
  includedSassFiles?: string[];
}


export interface BuildContext {
  moduleFiles: ModuleFiles;
  filesToWrite: FilesToWrite;
}


export interface ModuleFiles {
  [filePath: string]: ModuleFileMeta;
}


export interface CompileResults {
  moduleFiles: ModuleFiles;
  diagnostics: Diagnostic[];
  manifest?: Manifest;
  includedSassFiles?: string[];
}


export interface TranspileResults {
  moduleFiles: ModuleFiles;
  diagnostics: Diagnostic[];
}


export interface ModuleResults {
  bundles: {
    [bundleId: string]: string;
  };
  diagnostics: Diagnostic[];
}


export interface FilesToWrite {
  [filePath: string]: string;
}


export interface StylesResults {
  bundles: {
    [bundleId: string]: {
      [modeName: string]: string;
    };
  };
  diagnostics: Diagnostic[];
}


export interface BundleResults {
  diagnostics: Diagnostic[];
  componentRegistry: LoadComponentRegistry[];
}


export interface BuildResults {
  diagnostics: Diagnostic[];
  manifest: Manifest;
  componentRegistry: LoadComponentRegistry[];
}
