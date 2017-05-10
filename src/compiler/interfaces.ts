export * from '../util/interfaces';
import { ComponentMeta, ModeMeta } from '../util/interfaces';


export interface CompilerConfig {
  compilerOptions: {
    declaration?: boolean;
    lib?: string[];
    module?: 'es2015' | 'commonjs';
    outDir?: string;
    sourceMap?: boolean;
    target?: 'es5' | 'es2015';
  };
  include: string[];
  exclude?: string[];
  devMode?: boolean;
  debug?: boolean;
  bundles?: ManifestBundle[];
  packages: Packages;
  watch?: boolean;
}


export interface BundlerConfig {
  srcDir: string;
  destDir: string;
  devMode?: boolean;
  packages: Packages;
  debug?: boolean;
  attachRegistryTo?: 'core'|'loader';
  watch?: boolean;
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
  bundles?: Bundle[];
  bundledJsModules?: {[id: string]: string};

  registry?: Registry;
  isCompilerWatchInitialized?: boolean;
  isBundlerWatchInitialized?: boolean;
}


export interface Results {
  errors?: string[];
  files?: string[];
  manifest?: Manifest;
  manifestPath?: string;
  componentRegistry?: string;
}


export interface Registry {
  [tag: string]: any[];
}


export interface Bundle {
  id?: string;
  components?: {
    component: ManifestComponentMeta;
    mode: ModeMeta;
  }[];
  bundledJsModules?: string;
  content?: string;
  fileName?: string;
  filePath?: string;
  priority?: 'high'|'low';
}


export interface Manifest {
  components?: ManifestComponentMeta[];
  bundles?: ManifestBundle[];
}


export interface ManifestComponentMeta extends ComponentMeta {
  componentClass: string;
  componentUrl: string;
}


export interface ManifestBundle {
  components: string[];
  priority: 'high'|'low';
}


export interface Packages {
  path?: {
    basename(p: string, ext?: string): string;
    dirname(p: string): string;
    extname(p: string): string;
    join(...paths: string[]): string;
    sep: string;
  };
  fs?: {
    access(path: string | Buffer, callback: (err: any) => void): void;
    mkdir(path: string | Buffer, callback?: (err?: any) => void): void;
    readdir(path: string | Buffer, callback?: (err: any, files: string[]) => void): void;
    readFile(filename: string, encoding: string, callback: (err: any, data: string) => void): void;
    readFileSync(filename: string, encoding: string): string;
    stat(path: string | Buffer, callback?: (err: any, stats: { isFile(): boolean; isDirectory(): boolean; }) => any): void;
    writeFile(filename: string, data: any, callback?: (err: any) => void): void;
  };
  typescript?: any;
  nodeSass?: {
    render: Function;
  };
  rollup?: {
    rollup: Rollup;
  };
  uglify?: {
    minify: {(content: string, opts: any): {code: string}};
  };
}


export interface Rollup {
  (config: {
    entry: string;
    plugins?: any[];
    treeshake?: boolean;
  } ): Promise<{
    generate: {(config: {
      format?: string;
      banner?: string;
      footer?: string;
      exports?: string;
      external?: string[];
      globals?: {[key: string]: any};
      moduleName?: string;
      plugins?: any;
    }): {
      code: string;
      map: any;
    }}
  }>;
}
