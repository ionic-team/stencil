export * from '../util/interfaces';
import { ComponentMeta, Diagnostic, FSWatcher, Manifest, LoadComponentRegistry } from '../util/interfaces';


export interface ModuleFileMeta {
  tsFilePath?: string;
  tsText?: string;
  jsFilePath?: string;
  jsText?: string;
  hasCmpClass?: boolean;
  cmpMeta?: ComponentMeta;
  includedSassFiles?: string[];
}


export interface BuildContext {
  moduleFiles?: ModuleFiles;
  moduleBundleOutputs?: ModuleBundles;
  styleSassOutputs?: ModuleBundles;
  filesToWrite?: FilesToWrite;
  watcher?: FSWatcher;
  onFinish?: Function;
  tsConfig?: any;

  isRebuild?: boolean;
  isChangeBuild?: boolean;
  lastBuildHadError?: boolean;
  changeHasNonComponentModules?: boolean;
  changeHasComponentModules?: boolean;
  changeHasSass?: boolean;
  changeHasCss?: boolean;
  changeHasHtml?: boolean;
  changedFiles?: string[];

  sassBuildCount?: number;
  transpileBuildCount?: number;

  moduleBundleCount?: number;
  styleBundleCount?: number;
}


export interface ModuleFiles {
  [filePath: string]: ModuleFileMeta;
}


export interface ModuleBundles {
  [bundleId: string]: string;
}


export interface BuildResults {
  diagnostics: Diagnostic[];
  files: string[];
  componentRegistry: LoadComponentRegistry[];
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


export interface OptimizeHtmlResults {
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
