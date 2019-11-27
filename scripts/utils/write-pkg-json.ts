import fs from 'fs-extra';
import path from 'path';
import { BuildOptions } from './options';


export function writePkgJson(opts: BuildOptions, pkgDir: string, pkgData: PackageData) {
  pkgData.version = opts.version;
  pkgData.private = true;

  // idk, i just like a nice pretty standardized order of package.json properties
  const formatedPkg: any = {};
  PROPS_ORDER.forEach(pkgProp => {
    if (pkgProp in pkgData) {
      formatedPkg[pkgProp] = pkgData[pkgProp]
    }
  });

  fs.writeFileSync(
    path.join(pkgDir, 'package.json'),
    JSON.stringify(formatedPkg, null, 2) + '\n'
  );
}

const PROPS_ORDER = [
  'name', 'version', 'description', 'main', 'module', 'browser', 'types', 'private'
];

export interface PackageData {
  name: string;
  description: string;
  main: string;
  module?: string;
  browser?: string;
  types?: string;
  version?: string;
  dependencies?: string[];
  private?: boolean;
  license?: string | any;
  licenses?: string | any;
  author?: string | any;
  contributors?: string | any;
  homepage?: string;
  repository?: any;
  files?: string[];
  bin?: {[key: string]: string};
}
