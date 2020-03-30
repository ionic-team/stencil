import { CompilerSystem } from '../../declarations';
import { rollupVersion, version, terserVersion, typescriptVersion } from '../../version';
import { getRemoteModuleUrl } from '../sys/resolve/resolve-utils';

export const getRemoteTypeScriptUrl = (sys: CompilerSystem) => {
  const tsDep = dependencies.find(dep => dep.name === 'typescript');
  return getRemoteModuleUrl(sys, { moduleId: tsDep.name, version: tsDep.version, path: tsDep.main });
};

export const dependencies: CompilerDependency[] = [
  {
    name: '@stencil/core',
    version: version,
    main: 'compiler/stencil.min.js',
    resources: [
      'internal/index.d.ts',
      'internal/package.json',
      'internal/stencil-core.js',
      'internal/stencil-core.d.ts',
      'internal/stencil-ext-modules.d.ts',
      'internal/stencil-private.d.ts',
      'internal/stencil-public-compiler.d.ts',
      'internal/stencil-public-docs.d.ts',
      'internal/stencil-public-runtime.d.ts',
      'internal/client/css-shim.mjs',
      'internal/client/dom.mjs',
      'internal/client/index.mjs',
      'internal/client/shadow-css.mjs',
      'internal/client/package.json',
      'package.json',
    ],
  },
  {
    name: 'typescript',
    version: typescriptVersion,
    main: 'lib/typescript.js',
    resources: [
      'lib/lib.dom.d.ts',
      'lib/lib.es2015.d.ts',
      'lib/lib.es5.d.ts',
      'lib/lib.es2015.core.d.ts',
      'lib/lib.es2015.collection.d.ts',
      'lib/lib.es2015.generator.d.ts',
      'lib/lib.es2015.iterable.d.ts',
      'lib/lib.es2015.symbol.d.ts',
      'lib/lib.es2015.promise.d.ts',
      'lib/lib.es2015.proxy.d.ts',
      'lib/lib.es2015.reflect.d.ts',
      'lib/lib.es2015.symbol.wellknown.d.ts',
      'package.json',
    ],
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
  resources?: string[];
}
