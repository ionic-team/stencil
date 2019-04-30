import * as d from '../../declarations';

import { isOutputTargetDistLazyLoader } from './output-utils';
import { normalizePath, relativeImport } from '@utils';

export async function outputLazyLoader(config: d.Config, compilerCtx: d.CompilerCtx) {
  if (!config.buildDist) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazyLoader);
  if (outputTargets.length === 0) {
    return;
  }

  await Promise.all(
    outputTargets.map(o => generateLoader(config, compilerCtx, o))
  );
}

async function generateLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDistLazyLoader) {
  const loaderPath = outputTarget.dir;
  const es5Dir = outputTarget.esmEs5Dir;
  const es2017Dir = outputTarget.esmDir;
  const cjsDir = outputTarget.cjsDir;

  if (!loaderPath || !es5Dir || !es2017Dir || !cjsDir) {
    return;
  }

  const packageJsonContent = JSON.stringify({
    'name': config.fsNamespace + '-loader',
    'typings': './index.d.ts',
    'module': './index.mjs',
    'main': './index.cjs.js',
    'jsnext:main': './index.es2017.mjs',
    'es2015': './index.es2017.mjs',
    'es2017': './index.es2017.mjs'
  }, null, 2);

  const es5EntryPoint = config.sys.path.join(es5Dir, 'loader.esm.js');
  const es2017EntryPoint = config.sys.path.join(es2017Dir, 'loader.esm.js');
  const cjsEntryPoint = config.sys.path.join(cjsDir, 'loader.cjs.js');

  const indexPath = config.buildEs5 ? es5EntryPoint : es2017EntryPoint;
  const indexContent = `export * from '${normalizePath(config.sys.path.relative(loaderPath, indexPath))}';`;
  const indexES2017Content = `export * from '${normalizePath(config.sys.path.relative(loaderPath, es2017EntryPoint))}';`;
  const indexCjsContent = `module.exports = require('${normalizePath(config.sys.path.relative(loaderPath, cjsEntryPoint))}');`;

  const indexDtsPath = config.sys.path.join(loaderPath, 'index.d.ts');
  await Promise.all([
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.d.ts'), generateIndexDts(config, indexDtsPath, outputTarget.componentDts)),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.mjs'), indexContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.cjs.js'), indexCjsContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.es2017.mjs'), indexES2017Content)
  ]);
}


function generateIndexDts(config: d.Config, indexDtsPath: string, componentsDtsPath: string) {
  return `
export * from '${relativeImport(config, indexDtsPath, componentsDtsPath, '.d.ts')}';
export declare function defineCustomElements(win: Window, opts?: any): Promise<void>;
`;
}
