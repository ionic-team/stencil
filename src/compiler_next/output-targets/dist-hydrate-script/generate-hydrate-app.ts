import * as d from '../../../declarations';
import { bundleHydrateFactory } from './bundle-hydrate-factory';
import { DEFAULT_STYLE_MODE, catchError, createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { HYDRATE_FACTORY_INTRO, HYDRATE_FACTORY_OUTRO } from './hydrate-factory-closure';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';
import { RollupOptions } from 'rollup';
import { STENCIL_HYDRATE_FACTORY_ID, STENCIL_INTERNAL_PLATFORM_ID, STENCIL_MOCK_DOC_ID } from '../../bundle/entry-alias-ids';
import MagicString from 'magic-string';
import { rollup } from 'rollup';
import { join } from 'path';


export const generateHydrateApp = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) => {
  try {
    const packageDir = join(config.sys_next.getCompilerExecutingPath(), '..', '..');
    const input = join(packageDir, 'internal', 'hydrate', 'runner.mjs');
    const mockDoc = join(packageDir, 'mock-doc', 'index.mjs');

    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input,
      inlineDynamicImports: true,
      plugins: [
        {
          name: 'hydrateAppPlugin',
          resolveId(id) {
            if (id === STENCIL_HYDRATE_FACTORY_ID) {
              return id;
            }
            if (id === STENCIL_MOCK_DOC_ID) {
              return mockDoc;
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

    const rollupAppBuild = await rollup(rollupOptions);
    const rollupOutput = await rollupAppBuild.generate({
      format: 'cjs',
      file: 'index.js',
    });

    await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupOutput);

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(compilerCtx, buildCtx, e);
    }
  }
};


const generateHydrateFactory = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!buildCtx.hasError) {
    try {
      const cmps = buildCtx.components;
      const build = getBuildConditionals(config, cmps);

      const appFactoryEntryCode = await generateHydrateFactoryEntry(compilerCtx, buildCtx);

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
};


const generateHydrateFactoryEntry = async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const cmps = buildCtx.components;
  const hydrateCmps = await updateToHydrateComponents(compilerCtx, buildCtx, cmps);
  const s = new MagicString('');

  s.append(`import { hydrateApp, registerComponents, styles } from '${STENCIL_INTERNAL_PLATFORM_ID}';\n`);

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
};


const getBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateClientSide = false;
  build.hydrateServerSide = true;

  updateBuildConditionals(config, build);
  build.lifecycleDOMEvents = false;
  build.devTools = false;
  build.hotModuleReplacement = false;

  return build;
};
