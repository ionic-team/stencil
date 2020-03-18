import { rollupVersion, terserVersion, typescriptVersion } from '../../version';

const remoteDepUrl = 'https://cdn.jsdelivr.net/npm/';

export const getRemoteDependencyUrl = (dep: CompilerDependency) => `${remoteDepUrl}${dep.name}${dep.version ? '@' + dep.version : ''}${dep.main}`;

export const getRemoteTypeScriptUrl = () => {
  const tsDep = dependencies.find(dep => dep.name === 'typescript');
  return getRemoteDependencyUrl(tsDep);
};

export const dependencies: CompilerDependency[] = [
  {
    name: 'typescript',
    version: typescriptVersion,
    main: '/lib/typescript.js',
  },
  {
    name: 'rollup',
    version: rollupVersion,
    main: '/dist/rollup.browser.es.js',
  },
  {
    name: 'terser',
    version: terserVersion,
    main: '/dist/bundle.min.js',
  },
];

export interface CompilerDependency {
  name: string;
  version: string;
  main: string;
}
