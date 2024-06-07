import { catchError, createOnWarnFn, generatePreamble, join, loadRollupDiagnostics } from '@utils';
import MagicString from 'magic-string';
import { RollupOptions } from 'rollup';
import { rollup } from 'rollup';

import type * as d from '../../../declarations';
import {
  STENCIL_HYDRATE_FACTORY_ID,
  STENCIL_INTERNAL_HYDRATE_ID,
  STENCIL_MOCK_DOC_ID,
} from '../../bundle/entry-alias-ids';
import { bundleHydrateFactory } from './bundle-hydrate-factory';
import { HYDRATE_FACTORY_INTRO, HYDRATE_FACTORY_OUTRO } from './hydrate-factory-closure';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';

/**
 * Generate and build the hydrate app and then write it to disk
 *
 * @param config a validated Stencil configuration
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTargets the output targets for the current build
 */
export const generateHydrateApp = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTargets: d.OutputTargetHydrate[],
) => {
  try {
    const packageDir = join(config.sys.getCompilerExecutingPath(), '..', '..');
    const input = join(packageDir, 'internal', 'hydrate', 'runner.js');
    const mockDoc = join(packageDir, 'mock-doc', 'index.js');

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
          },
        },
      ],
      treeshake: false,
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupAppBuild = await rollup(rollupOptions);
    const rollupCjsOutput = await rollupAppBuild.generate({
      banner: generatePreamble(config),
      format: 'cjs',
      file: 'index.js',
    });
    const rollupEsmOutput = await rollupAppBuild.generate({
      banner: generatePreamble(config),
      format: 'esm',
      file: 'index.mjs',
    });

    await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupCjsOutput, rollupEsmOutput);
  } catch (e: any) {
    if (!buildCtx.hasError) {
      // TODO(STENCIL-353): Implement a type guard that balances using our own copy of Rollup types (which are
      // breakable) and type safety (so that the error variable may be something other than `any`)
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
};

const generateHydrateFactory = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!buildCtx.hasError) {
    try {
      const appFactoryEntryCode = await generateHydrateFactoryEntry(buildCtx);

      const rollupFactoryBuild = await bundleHydrateFactory(config, compilerCtx, buildCtx, appFactoryEntryCode);
      if (rollupFactoryBuild != null) {
        const rollupOutput = await rollupFactoryBuild.generate({
          format: 'cjs',
          esModule: false,
          strict: false,
          intro: HYDRATE_FACTORY_INTRO,
          outro: HYDRATE_FACTORY_OUTRO,
          preferConst: false,
          inlineDynamicImports: true,
        });

        if (!buildCtx.hasError && rollupOutput != null && Array.isArray(rollupOutput.output)) {
          return rollupOutput.output[0].code;
        }
      }
    } catch (e: any) {
      catchError(buildCtx.diagnostics, e);
    }
  }
  return '';
};

const generateHydrateFactoryEntry = async (buildCtx: d.BuildCtx) => {
  const cmps = buildCtx.components;
  const hydrateCmps = await updateToHydrateComponents(cmps);
  const s = new MagicString('');

  s.append(`import { hydrateApp, registerComponents, styles } from '${STENCIL_INTERNAL_HYDRATE_ID}';\n`);

  hydrateCmps.forEach((cmpData) => s.append(cmpData.importLine + '\n'));

  s.append(`registerComponents([\n`);
  hydrateCmps.forEach((cmpData) => {
    s.append(`  ${cmpData.uniqueComponentClassName},\n`);
  });
  s.append(`]);\n`);
  s.append(`export { hydrateApp }\n`);

  return s.toString();
};
