import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError, dashToPascalCase } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { isOutputTargetDistCustomElementsBundle } from '../../../compiler/output-targets/output-utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import path from 'path';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../../../compiler/app-core/format-component-runtime-meta';


export const outputCustomElementsBundle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (config.devMode) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements bundle started`);

  try {
    const bundleOpts: BundleOptions = {
      id: 'customElementsBundle',
      platform: 'client',
      conditionals: getBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomTransformer(compilerCtx),
      inputs: {
        'index': '@core-entrypoint'
      },
      loader: {
        '@core-entrypoint': generateEntryPoint(config, compilerCtx, buildCtx)
      },
      inlineDynamicImports: true,
    };

    const code = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    await Promise.all(
      outputTargets.map(o => {
        return compilerCtx.fs.writeFile(
          path.join(o.dir, 'index.mjs'),
          code,
          { outputTargetType: o.type }
        );
      })
    );

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom elements bundle finished`);
};

function generateEntryPoint(_config: d.Config, _compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const imports: string[] = [];
  const exports: string[] = [];
  imports.push(
    `import { proxyNative, globalScripts } from '${STENCIL_INTERNAL_CLIENT_ID}';`,
    `export * from '${USER_INDEX_ENTRY_ID}';`,
    'globalScripts();',
  );

  buildCtx.components.forEach(cmp => {
    const exportName = dashToPascalCase(cmp.tagName);
    const importName = cmp.componentClassName;
    const importAs = `$Cmp${exportName}`;

    if (cmp.isPlain) {
      exports.push(
        `export { ${importName} as ${exportName} } from '${cmp.sourceFilePath}';`,
      );

    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

      imports.push(
        `import { ${importName} as ${importAs} } from '${cmp.sourceFilePath}';`
      );

      exports.push(
        `export const ${exportName} = /*@__PURE__*/proxyNative(${importAs}, ${meta});`
      );
    }
  });

  return [
    ...imports,
    ...exports,
    ''
  ].join('\n');
}

function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  build.taskQueue = false;
  updateBuildConditionals(config, build);
  build.devTools = false;

  return build;
}

const getCustomTransformer = (compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: null,
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts)
  ];
};
