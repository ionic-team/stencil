import { compilerBuild } from '../../version';

const remoteDepUrl = 'https://cdn.jsdelivr.net/npm/';


export const getRemoteDependencyUrl = (dep: CompilerDependency) => {
  return `${remoteDepUrl}${dep.name}${dep.version ? '@' + dep.version : ''}${dep.main}`;
};


export const dependencies: CompilerDependency[] = [
  {
    name: 'typescript',
    version: compilerBuild.typescriptVersion,
    main: '/lib/typescript.js',
  },
  {
    name: 'rollup',
    version: compilerBuild.rollupVersion,
    main: '/dist/rollup.browser.es.js'
  },
  {
    name: 'terser',
    version: compilerBuild.terserVersion,
    main: '/dist/bundle.min.js'
  }
];

export interface CompilerDependency {
  name: string;
  version: string;
  main: string;
}
