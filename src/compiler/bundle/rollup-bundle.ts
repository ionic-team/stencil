import * as d from '../../declarations';
import abortPlugin from './rollup-plugins/abort-plugin';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import bundleJson from './rollup-plugins/json';
import { dashToPascalCase } from '../../util/helpers';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, normalizePath } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import { getHyperScriptFnEsmFileName } from '../app/app-file-naming';
import { getUserCompilerOptions } from '../transpile/compiler-options';
import localResolution from './rollup-plugins/local-resolution';
import inMemoryFsRead from './rollup-plugins/in-memory-fs-read';
import { RollupBuild, RollupDirOptions, rollup } from 'rollup';
import nodeEnvVars from './rollup-plugins/node-env-vars';
import pathsResolution from './rollup-plugins/paths-resolution';
import { EntryModule } from '../../declarations';


export async function createBundle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (!buildCtx.isActiveBuild) {
    buildCtx.debug(`createBundle aborted, not active build`);
  }

  const timeSpan = buildCtx.createTimeSpan(`createBundle started`, true);

  const builtins = require('rollup-plugin-node-builtins');
  const globals = require('rollup-plugin-node-globals');
  let rollupBundle: RollupBuild;

  const commonjsConfig = {
    include: 'node_modules/**',
    sourceMap: false,
    ...config.commonjs
  };

  const nodeResolveConfig: d.NodeResolveConfig = {
    jsnext: true,
    main: true,
    ...config.nodeResolve
  };

  const tsCompilerOptions = await getUserCompilerOptions(config, compilerCtx);

  const rollupConfig: RollupDirOptions = {
    input: entryModules.map(b => b.entryKey),
    experimentalCodeSplitting: true,
    preserveSymlinks: false,
    plugins: [
      abortPlugin(buildCtx),
      config.sys.rollup.plugins.nodeResolve(nodeResolveConfig),
      config.sys.rollup.plugins.commonjs(commonjsConfig),
      bundleJson(config),
      globals(),
      builtins(),
      inMemoryFsRead(config, compilerCtx, buildCtx),
      pathsResolution(config, compilerCtx, tsCompilerOptions),
      localResolution(config, compilerCtx),
      nodeEnvVars(config),
      ...config.plugins,
      abortPlugin(buildCtx)
    ],
    onwarn: createOnWarnFn(config, buildCtx.diagnostics)
  };

  try {
    rollupBundle = await rollup(rollupConfig);

  } catch (err) {
    // looks like there was an error bundling!
    if (buildCtx.isActiveBuild) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, err);

    } else {
      buildCtx.debug(`createBundle errors ignored, not active build`);
    }
  }

  timeSpan.finish(`createBundle finished`);

  return rollupBundle;
}

export async function writeEntryModules(config: d.Config, entryModules: EntryModule[]) {
  const path = config.sys.path;

  Promise.all(
    entryModules.map(entryModule => {
      const fileContents = entryModule.moduleFiles
        .map(moduleFile => {
          const originalClassName = moduleFile.cmpMeta.componentClass;
          const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

          const filePath = normalizePath(path.relative(path.dirname(entryModule.entryKey), moduleFile.jsFilePath));
          return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
        })
        .join('\n');
      return config.sys.fs.writeFile(entryModule.entryKey, fileContents);
    })
  );
}


export async function writeEsModules(config: d.Config, rollupBundle: RollupBuild) {
  const { output } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h } = window.${config.namespace};`,
  });
  return <any>output as d.JSModuleList;
}


export async function writeLegacyModules(config: d.Config, rollupBundle: RollupBuild, entryModules: d.EntryModule[]) {
  if (!config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    return null;
  }

  rollupBundle.cache.modules.forEach(module => {
    const key = module.id;
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = module.dependencies.slice();
    }
  });

  const { output } = await rollupBundle.generate({
    format: 'amd',
    amd: {
      id: getBundleIdPlaceholder(),
      define: `${config.namespace}.loadBundle`
    },
    banner: generatePreamble(config),
    intro: `const h = window.${config.namespace}.h;`,
    strict: false,
  });

  return <any>output as d.JSModuleList;
}


export async function writeEsmEs5Modules(config: d.Config, rollupBundle: RollupBuild) {
  if (config.outputTargets.some(o => o.type === 'dist')) {
    const { output } = await rollupBundle.generate({
      format: 'es',
      banner: generatePreamble(config),
      intro: `import { h } from './${getHyperScriptFnEsmFileName(config)}';`,
      strict: false,
    });

    return <any>output as d.JSModuleList;
  }

  return null;
}
