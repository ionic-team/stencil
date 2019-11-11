import * as d from '../../declarations';
import { bundleApp, generateRollupOutput } from '../app-core/bundle-app-core';
import { dashToPascalCase } from '@utils';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { hasGlobalScriptPaths } from '../rollup-plugins/global-scripts';
import { isOutputTargetDistModule } from './output-utils';
import { optimizeModule } from '../app-core/optimize-module';


export async function outputModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistModule);
  if (outputTargets.length === 0) {
    return;
  }
  const timespan = buildCtx.createTimeSpan(`generate webcomponents module started`);
  await generateModuleWebComponents(config, compilerCtx, buildCtx, outputTargets);
  timespan.finish(`generate webcomponents module finished`);
}

export async function generateModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistModule[]) {
  await buildCtx.stylesPromise;

  const timespan = buildCtx.createTimeSpan(`generate module web components started`, true);

  await Promise.all([
    bundleRawComponents(config, compilerCtx, buildCtx, outputTargets.filter(o => o.externalRuntime), true),
    bundleRawComponents(config, compilerCtx, buildCtx, outputTargets.filter(o => !o.externalRuntime), false),
  ]);

  timespan.finish(`generate module web components finished`);
}

async function bundleRawComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistModule[], externalRuntime: boolean) {
  const cmps = buildCtx.components;
  const build = getBuildConditionals(config, cmps);

  const rollupResults = await bundleNativeModule(config, compilerCtx, buildCtx, build, externalRuntime);

  if (Array.isArray(rollupResults) && !buildCtx.hasError) {
    await Promise.all(
      rollupResults.map(async result => {
        let code = result.code;

        if (!externalRuntime && config.minifyJs) {
          const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', true, code);
          buildCtx.diagnostics.push(...optimizeResults.diagnostics);

          if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
            code = optimizeResults.output;
          }
        }

        await Promise.all(outputTargets.map(async outputTarget => {
          const filePath = config.sys.path.join(outputTarget.dir, result.fileName);
          await compilerCtx.fs.writeFile(filePath, code);
        }));
      })
    );
  }
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  build.taskQueue = false;
  updateBuildConditionals(config, build);
  build.devTools = false;

  return build;
}

export async function bundleNativeModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, externalRuntime: boolean) {
  const bundleAppOptions: d.BundleAppOptions = {
    inputs: {
      'index': '@core-entrypoint'
    },
    loader: {
      '@core-entrypoint': generateEntryPoint(config, compilerCtx, buildCtx.entryModules)
    },
    // TODO: fix dist-module rollup caching
    // cache: compilerCtx.rollupCacheNative,
    externalRuntime: externalRuntime ? '@stencil/core/runtime' : undefined,
    skipDeps: true
  };

  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleAppOptions);
  if (rollupBuild != null) {
    compilerCtx.rollupCacheNative = rollupBuild.cache;

  } else {
    compilerCtx.rollupCacheNative = null;
  }

  return generateRollupOutput(rollupBuild, { format: 'esm' }, config, buildCtx.entryModules);
}

function generateEntryPoint(config: d.Config, compilerCtx: d.CompilerCtx, entryModules: d.EntryModule[]) {
  const imports: string[] = [];
  const exports: string[] = [];
  const statements: string[] = [];

  const hasGlobal = hasGlobalScriptPaths(config, compilerCtx);
  if (hasGlobal) {
    imports.push(
      `import { proxyNative, globals } from '@stencil/core';`
    );

    statements.push(
      `globals();`
    );

  } else {
    imports.push(
      `import { proxyNative } from '@stencil/core';`
    );
  }

  entryModules.forEach(entry => entry.cmps.forEach(cmp => {
    const exportName = dashToPascalCase(cmp.tagName);

    if (cmp.isPlain) {
      exports.push(
        `export { ${exportName} } from '${entry.entryKey}';`,
      );

    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));
      const importAs = `$Cmp${exportName}`;

      imports.push(
        `import { ${exportName} as ${importAs} } from '${entry.entryKey}';`
      );

      exports.push(
        `export const ${exportName} = /*@__PURE__*/proxyNative(${importAs}, ${meta});`
      );
    }
  }));

  return [
    ...imports,
    ...exports,
    ...statements
  ].join('\n');
}
