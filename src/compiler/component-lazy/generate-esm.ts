import * as d from '../../declarations';
import { generateRollupBuild } from '../app-core/bundle-app-core';
import { generateLazyModules } from '../component-lazy/generate-lazy-module';
import { OutputOptions, RollupBuild } from 'rollup';
import { normalizePath } from '@utils';

export async function generateEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, rollupBuild: RollupBuild, outputTargets: d.OutputTargetDistLazy[]) {
  const esmEs5Outputs = config.buildEs5 ? outputTargets.filter(o => !!o.esmEs5Dir) : [];
  const esmOutputs = outputTargets.filter(o => !!o.esmDir);

  if (esmOutputs.length + esmEs5Outputs.length > 0) {
    const esmOpts: OutputOptions = {
      format: 'esm',
      entryFileNames: '[name].mjs.js',
      chunkFileNames: build.isDev ? '[name]-[hash].js' : '[hash].js'
    };
    const results = await generateRollupBuild(rollupBuild, esmOpts, config, buildCtx.entryModules);
    if (results != null) {
      const es2017destinations = esmOutputs.map(o => o.esmDir);
      await generateLazyModules(config, compilerCtx, buildCtx, es2017destinations, results, 'es2017', '');

      const es5destinations = esmEs5Outputs.map(o => o.esmEs5Dir);
      await generateLazyModules(config, compilerCtx, buildCtx, es5destinations, results, 'es5', '');
      await generateEsmLoaders(config, compilerCtx, outputTargets);
    }
  }
}

function generateEsmLoaders(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) {
  return Promise.all(
    outputTargets.map(o => generateLoader(config, compilerCtx, o))
  );
}

async function generateLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDistLazy) {
  const loaderPath = outputTarget.loaderDir;
  const es5Dir = outputTarget.esmEs5Dir;
  const es2017Dir = outputTarget.esmDir;
  const cjsDir = outputTarget.cjsDir;
  if (!loaderPath || !es5Dir || !es2017Dir || !cjsDir) {
    return;
  }

  const packageJsonContent = JSON.stringify({
    'name': 'loader',
    'typings': './index.d.ts',
    'module': './index.js',
    'main': './index.cjs.js',
    'jsnext:main': './index.es2017.js',
    'es2015': './index.es2017.js',
    'es2017': './index.es2017.js'
  }, null, 2);

  const es5EntryPoint = config.sys.path.join(es5Dir, 'loader.esm.js');
  const es2017EntryPoint = config.sys.path.join(es2017Dir, 'loader.esm.js');
  const cjsEntryPoint = config.sys.path.join(cjsDir, 'loader.cjs.js');

  const indexPath = config.buildEs5 ? es5EntryPoint : es2017EntryPoint;
  const indexContent = `export * from '${normalizePath(config.sys.path.relative(loaderPath, indexPath))}';`;
  const indexES2017Content = `export * from '${normalizePath(config.sys.path.relative(loaderPath, es2017EntryPoint))}';`;
  const indexCjsContent = `module.exports = require('${normalizePath(config.sys.path.relative(loaderPath, cjsEntryPoint))}');`;

  await Promise.all([
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'package.json'), packageJsonContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.d.ts'), INDEX_DTS),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.js'), indexContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.cjs.js'), indexCjsContent),
    compilerCtx.fs.writeFile(config.sys.path.join(loaderPath, 'index.es2017.js'), indexES2017Content)
  ]);
}

const INDEX_DTS = 'export declare function defineCustomElements(win: any, opts?: any): Promise<void>;';
