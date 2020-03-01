import * as d from '../../declarations';
import { bundleHydrateFactory } from './bundle-hydrate-factory_legacy';
import { DEFAULT_STYLE_MODE, catchError, createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../compiler_next/build/app-data';
import { HYDRATE_FACTORY_INTRO, HYDRATE_FACTORY_OUTRO } from '../../compiler_next/output-targets/dist-hydrate-script/hydrate-factory-closure';
import { updateToHydrateComponents } from './update-to-hydrate-components_legacy';
import { writeHydrateOutputs } from './write-hydrate-outputs_legacy';
import { RollupBuild, RollupOptions } from 'rollup';
import MagicString from 'magic-string';
import { STENCIL_HYDRATE_FACTORY_ID, STENCIL_INTERNAL_HYDRATE_ID, STENCIL_MOCK_DOC_ID } from '../../compiler_next/bundle/entry-alias-ids';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) {
  try {
    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input: config.sys.path.join(config.sys.compiler.packageDir, 'internal', 'hydrate', 'runner.mjs'),
      inlineDynamicImports: true,
      plugins: [
        {
          name: 'hydrateAppPlugin',
          resolveId(id) {
            if (id === STENCIL_HYDRATE_FACTORY_ID) {
              return id;
            }
            if (id === STENCIL_MOCK_DOC_ID) {
              return config.sys.path.join(config.sys.compiler.packageDir, 'mock-doc', 'index.mjs');
            }
            return null;
          },
          load(id) {
            if (id === STENCIL_HYDRATE_FACTORY_ID) {
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
      file: 'index.js',
    });

    await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupOutput);

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
}


async function generateHydrateFactory(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.hasError) {
    try {
      const cmps = buildCtx.components;
      const build = getBuildConditionals(config, cmps);

      const appFactoryEntryCode = await generateHydrateFactoryEntry(config, compilerCtx, buildCtx);

      const rollupFactoryBuild = await bundleHydrateFactory(config, compilerCtx, buildCtx, build, appFactoryEntryCode);
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


async function generateHydrateFactoryEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const cmps = buildCtx.components;
  const hydrateCmps = await updateToHydrateComponents(config, compilerCtx, buildCtx, cmps);
  const s = new MagicString('');

  s.append(`import { hydrateApp, registerComponents, styles } from '${STENCIL_INTERNAL_HYDRATE_ID}';\n`);

  hydrateCmps.forEach(cmpData => s.append(cmpData.importLine + '\n'));

  s.append(`registerComponents([\n`);
  hydrateCmps.forEach(cmpData => {
    s.append(`  ${cmpData.uniqueComponentClassName},\n`);
  });
  s.append(`]);\n`);

  await buildCtx.stylesPromise;

  hydrateCmps.forEach(cmpData => {
    cmpData.cmp.styles.forEach(style => {
      let scopeId = 'sc-' + cmpData.cmp.tagName;
      if (style.modeName !== DEFAULT_STYLE_MODE) {
        scopeId += `-${style.modeName}`;
      }

      if (typeof style.compiledStyleTextScopedCommented === 'string') {
        s.append(`styles.set('${scopeId}','${style.compiledStyleTextScopedCommented}');\n`);
      } else {
        s.append(`styles.set('${scopeId}','${style.compiledStyleTextScoped}');\n`);
      }
    });
  });

  s.append(`export { hydrateApp }\n`);

  return s.toString();
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateClientSide = false;
  build.hydrateServerSide = true;

  updateBuildConditionals(config, build);
  build.lifecycleDOMEvents = false;
  build.devTools = false;
  build.hotModuleReplacement = false;
  build.cloneNodeFix = false;
  build.appendChildSlotFix = false;

  return build;
}

