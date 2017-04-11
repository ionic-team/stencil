

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
  debug?: boolean;
  bundles?: string[][];
  packages: {
    nodeSass: {
      render: Function;
    };
  }
}


export interface FileMeta {
  fileName: string;
  fileExt: string;
  filePath: string;
  srcDir: string;
  srcText: string;
  srcTextWithoutDecorators: string;
  jsFilePath: string;
  jsText: string;
  isTsSourceFile: boolean;
  isTransformable: boolean;
  cmpMeta: ComponentMeta;
}


export interface BuildContext {
  files?: Map<string, FileMeta>;
  results?: Results;
  bundles?: Bundle[];
  components?: CoreComponents;
  registry?: Registry;
  manifest?: Manifest;
}


export interface BundlerConfig {
  srcDir: string;
  destDir: string;
  devMode?: boolean;
  packages: {
    nodeSass: {
      render: Function;
    };
    uglify: {
      minify: Function;
    };
    rollup: {
      rollup: Function;
    };
  }
  debug?: boolean;
}


export interface Results {
  errors?: string[];
}


export interface Registry {
  [tag: string]: any[];
}


export interface Bundle {
  id?: string;
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
  observedAttrs?: string[];
  hostCss?: string;
  componentModule?: any;
  modes: {[modeName: string]: ComponentMode};
}


export interface PropOptions {
  type?: 'string' | 'boolean' | 'number' | 'Array' | 'Object';
}


export interface Props {
  [propName: string]: PropOptions;
}