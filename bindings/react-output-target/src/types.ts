export interface OutputTargetReact {
  componentCorePackage?: string;
  proxiesFile: string;
  excludeComponents?: string[];
  loaderDir?: string;
}

export interface PackageJSON {
  types: string;
}
