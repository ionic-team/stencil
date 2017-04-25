

export interface CompilerConfig {
  compilerOptions: {
    declaration?: boolean;
    lib?: string[];
    module?: 'es2015' | 'commonjs';
    outDir?: string;
    sourceMap?: boolean;
    target?: 'es5' | 'es2015';
  },
  include: string[];
  exclude?: string[];
  devMode?: boolean;
  debug?: boolean;
  bundles?: string[][];
  packages: Packages;
}


export interface BundlerConfig {
  srcDir: string;
  destDir: string;
  devMode?: boolean;
  packages: Packages;
  debug?: boolean;
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
  hasCmpClass: boolean;
  cmpMeta: ComponentMeta;
  cmpClassName: string;
}


export interface BuildContext {
  files?: Map<string, FileMeta>;
  results?: Results;
  bundles?: Bundle[];
  components?: CoreComponents;
  registry?: Registry;
  manifest?: Manifest;
}


export interface Results {
  errors?: string[];
}


export interface Registry {
  [tag: string]: any[];
}


export interface Bundle {
  id?: number;
  components?: {
    component: Component;
    mode: ComponentMode
  }[];
  content?: string;
  fileName?: string;
  filePath?: string;
}


export interface Manifest {
  components?: CoreComponents;
  bundles?: string[][];
  coreFiles?: {
    core: string;
    core_ce: string;
    core_sd_ce: string;
    [key: string]: string;
  }
}


export interface CoreComponents {
  [tag: string]: Component;
}


export interface Component {
  tag?: string;
  modes: {[modeName: string]: ComponentMode};
  props: Props;
  listeners: Listeners;
  watches: Watches;
  shadow: boolean;
  componentClass: string;
  componentUrl: string;
  componentImporter?: string;
}


export interface ComponentMode {
  name?: string;
  styleUrls?: string[];
  styles?: string;
}


export interface ComponentMeta {
  tag?: string;
  props?: Props;
  listeners?: Listeners;
  watches?: Watches;
  shadow?: boolean;
  observedAttrs?: string[];
  hostCss?: string;
  componentModule?: any;
  modes: {[modeName: string]: ComponentMode};
}


export interface PropOptions {
  type?: string;
}


export interface Props {
  [propName: string]: PropOptions;
}


export interface Listeners {
  [methodName: string]: ListenOpts;
}


export interface ListenOpts {
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}


export interface WatchOpts {
  fn: string;
}


export interface Watches {
  [propName: string]: WatchOpts;
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
  typescript?: {

  };
  nodeSass?: {
    render: Function;
  };
  rollup?: {
    rollup: Rollup;
  };
  uglify?: {
    minify: {(content: string, opts: any): {code: string;}};
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
      moduleName?: string;
      plugins?: any;
    }): {
      code: string;
      map: any;
    }}
  }>;
}
