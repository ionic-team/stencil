import * as d from '../../declarations';
import { bundleHydrateFactory } from './bundle-hydrate-factory';
import { DEFAULT_STYLE_MODE, catchError, createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { HYDRATE_FACTORY_INTRO, HYDRATE_FACTORY_OUTRO } from './hydrate-factory-closure';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';
import { RollupBuild, RollupOptions } from 'rollup';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) {
  try {
    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input: config.sys.path.join(config.sys.compiler.distDir, 'hydrate', 'index.mjs'),
      inlineDynamicImports: true,
      plugins: [
        {
          name: 'hydrateAppPlugin',
          resolveId(id) {
            if (id === '@stencil/core/hydrate-factory') {
              return id;
            }
            if (id === '@stencil/core/mock-doc') {
              return config.sys.path.join(config.sys.compiler.distDir, 'mock-doc', 'index.mjs');
            }
            return null;
          },
          load(id) {
            if (id === '@stencil/core/hydrate-factory') {
              return generateHydrateFactory(config, compilerCtx, buildCtx);
            }
            return null;
          }
        }
      ],
      treeshake: false,
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupAppBuild: RollupBuild = await config.sys.rollup.rollup(rollupOptions);
    const rollupOutput = await rollupAppBuild.generate({
      format: 'cjs',
    });

    await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupOutput);

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(compilerCtx, buildCtx, e);
    }
  }
}


async function generateHydrateFactory(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.hasError) {
    try {
      const cmps = buildCtx.components;
      const build = getBuildConditionals(config, cmps);

      const appEntryCode = await generateHydrateAppCore(config, compilerCtx, buildCtx);

      const rollupFactoryBuild = await bundleHydrateFactory(config, compilerCtx, buildCtx, build, appEntryCode);
      if (rollupFactoryBuild != null) {
        const rollupOutput = await rollupFactoryBuild.generate({
          format: 'cjs',
          esModule: false,
          strict: false,
          intro: HYDRATE_FACTORY_INTRO,
          outro: HYDRATE_FACTORY_OUTRO,
          preferConst: false,
        });

        if (!buildCtx.hasError && rollupOutput != null && Array.isArray(rollupOutput.output)) {
          return rollupOutput.output[0].code;
        }
      }

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }
  }
  return '';
}


async function generateHydrateAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const cmps = buildCtx.components;
  const coreText: string[] = [];
  const hydrateCmps = await updateToHydrateComponents(config, compilerCtx, buildCtx, cmps);

  coreText.push(`import { hydrateApp, registerComponents, styles } from '@stencil/core/platform';`);
  coreText.push(`import globals from '@stencil/core/global-scripts';`);

  hydrateCmps.forEach(cmpData => coreText.push(cmpData.importLine));

  coreText.push(`globals();`);

  coreText.push(`const cmps = [`);
  hydrateCmps.forEach(cmpData => {
    coreText.push(`  ${cmpData.uniqueComponentClassName},`);
  });
  coreText.push(`];`);
  coreText.push(`registerComponents(cmps);`);

  await buildCtx.stylesPromise;

  hydrateCmps.forEach(cmpData => {
    cmpData.cmp.styles.forEach(style => {
      let scopeId = 'sc-' + cmpData.cmp.tagName;
      if (style.modeName !== DEFAULT_STYLE_MODE) {
        scopeId += `-${style.modeName}`;
      }

      if (typeof style.compiledStyleTextScopedCommented === 'string') {
        coreText.push(`styles.set('${scopeId}','${style.compiledStyleTextScopedCommented}');`);
      } else {
        coreText.push(`styles.set('${scopeId}','${style.compiledStyleTextScoped}');`);
      }
    });
  });

  coreText.push(`export { hydrateApp }`);

  return coreText.join('\n');
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = true;
  build.hydrateClientSide = false;
  build.hydrateServerSide = true;

  updateBuildConditionals(config, build);
  build.lifecycleDOMEvents = false;
  build.devTools = false;
  build.hotModuleReplacement = false;

  return build;
}

