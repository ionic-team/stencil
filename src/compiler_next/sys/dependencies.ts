import { compilerBuild } from '../../version';

const remoteDepUrl = 'https://cdn.jsdelivr.net/npm/';


export const getRemoteDependencyUrl = (dep: CompilerDependency) => {
  return `${remoteDepUrl}${dep.name}${dep.version ? '@' + dep.version : ''}${dep.entry}`;
};


export const dependencies: CompilerDependency[] = [
  {
    name: 'typescript',
    version: compilerBuild.typescriptVersion,
    entry: '/lib/typescript.js',
  },
  {
    name: 'rollup',
    version: compilerBuild.rollupVersion,
    entry: '/dist/rollup.browser.es.js'
  },
  {
    name: 'terser',
    version: compilerBuild.terserVersion,
    entry: '/dist/bundle.min.js'
  }
];

export interface CompilerDependency {
  name: string;
  version: string;
  entry: string;
}
