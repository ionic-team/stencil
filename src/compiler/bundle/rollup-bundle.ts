import { BuildConfig, BuildContext, ManifestBundle, RollupBundle } from '../../util/interfaces';
import bundleResolution from './rollup-plugins/bundle-resolution';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';


export async function runRollup(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  let rollupBundle: RollupBundle;

  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: getBundleEntryInput(manifestBundle),
      cache: ctx.rollupCache[manifestBundle.cacheKey],
      plugins: [
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        bundleResolution(manifestBundle, ctx.moduleFiles),
        transpiledInMemoryPlugin(config, ctx),
        localResolution(config),
      ],
      onwarn: createOnWarnFn(ctx.diagnostics, manifestBundle.moduleFiles)

    });

  } catch (err) {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }

  // cache for later
  // watch out for any rollup cache bugs
  // https://github.com/rollup/rollup/issues/1372
  ctx.rollupCache[manifestBundle.cacheKey] = rollupBundle;

  return rollupBundle;
}


export function getBundleEntryInput(manifestBundle: ManifestBundle) {
  // every component in the bundle has already inject imports pointing
  // to the other components in the bundle from the typescript transforms
  // any one of the transpiled components could act as the entry input
  if (!manifestBundle.moduleFiles || !manifestBundle.moduleFiles.length) {
    throw new Error(`invalid manifest bundle entry input: ${manifestBundle.cacheKey}`);
  }

  let components = manifestBundle.moduleFiles.filter(m => m.cmpMeta && m.jsFilePath);
  if (!components.length) {
    throw new Error(`no valid components found in bundle entry input: ${manifestBundle.cacheKey}`);
  }

  // sort by tagname so we're consisten
  components = components.sort((a, b) => {
    if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
    if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
    return 0;
  });

  // use the first component in the bundle as the entry input
  return components[0].jsFilePath;
}


export async function generateEsModule(config: BuildConfig, rollupBundle: RollupBundle) {
  const { code } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h } = window.${config.namespace};`
  });

  return code;
}


export async function generateLegacyModule(config: BuildConfig, rollupBundle: RollupBundle) {
  const { code } = await rollupBundle.generate({
    format: 'cjs',
    banner: generatePreamble(config),
    intro: `${config.namespace}.loadComponents(function(exports){` +
           `"use strict";\n` +
           `var h = ${config.namespace}.h;`,
            // module content w/ commonjs exports object
    outro: `\n},"${getBundleIdPlaceholder()}");`,
    strict: false
  });

  return code;
}
