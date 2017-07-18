export * from '../util/interfaces';
import { ComponentMeta, Diagnostic, FilesMap, FSWatcher, Manifest, LoadComponentRegistry } from '../util/interfaces';


export interface ModuleFileMeta {
  tsFilePath?: string;
  tsText?: string;
  jsFilePath?: string;
  hasCmpClass?: boolean;
  cmpMeta?: ComponentMeta;
  includedSassFiles?: string[];
}


export interface BuildContext {
  moduleFiles?: ModuleFiles;
  jsFiles?: FilesMap;
  cssFiles?: FilesMap;
  moduleBundleOutputs?: ModuleBundles;
  styleSassOutputs?: ModuleBundles;
  filesToWrite?: FilesMap;
  projectFiles?: {
    loader?: string;
    core?: string;
    coreEs5?: string;
    registryJson?: string;
    indexHtml?: string;
  };
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
  indexBuildCount?: number;
  projectFileBuildCount?: number;

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
  manifest: Manifest;
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
  html?: string;
  diagnostics: Diagnostic[];
}


export interface ModuleResults {
  bundles: {
    [bundleId: string]: string;
  };
  diagnostics: Diagnostic[];
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
