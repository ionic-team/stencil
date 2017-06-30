export * from '../util/interfaces';
import { ComponentMeta, Manifest, Bundle, Logger, StencilSystem } from '../util/interfaces';


export interface CompilerConfig {
  compilerOptions: {
    declaration?: boolean;
    lib?: string[];
    module?: 'es2015' | 'commonjs';
    rootDir?: string;
    outDir?: string;
    sourceMap?: boolean;
    target?: 'es5' | 'es2015';
  };
  include: string[];
  exclude?: string[];
  isDevMode?: boolean;
  bundles?: Bundle[];
  sys: StencilSystem;
  logger: Logger;
  isWatch?: boolean;
}


export interface BundlerConfig {
  namespace: string;
  srcDir: string;
  destDir: string;
  devMode?: boolean;
  logger: Logger;
  sys: StencilSystem;
  attachRegistryTo?: 'core'|'loader';
  isWatch?: boolean;
  attrCase?: number;
  manifest: Manifest;
}


export interface FileMeta {
  fileName: string;
  fileExt: string;
  filePath: string;
  srcDir: string;
  srcText: string;
  jsFilePath: string;
  jsText: string;
  isTsSourceFile: boolean;
  isScssSourceFile: boolean;
  hasCmpClass: boolean;
  cmpMeta: ComponentMeta;
  cmpClassName: string;
  isWatching: boolean;
  recompileOnChange: boolean;
  rebundleOnChange: boolean;
  transpiledCount: number;
}


export interface BuildContext {
  files?: Map<string, FileMeta>;
  results?: Results;

  isCompilerWatchInitialized?: boolean;
  isBundlerWatchInitialized?: boolean;
}


export interface StylesResults {
  [bundleId: string]: {
    [modeName: string]: string;
  };
}


export interface ModuleResults {
  [bundleId: string]: string;
}


export interface Results {
  errors?: string[];
  files?: string[];
  manifest?: Manifest;
  manifestPath?: string;
  componentRegistry?: string;
}
