import { BuildConfig, BuildContext, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { hasError } from '../util';
import { buildExpressionReplacer } from '../build/replacer';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpile-in-memory';
import stencilManifestsToInputs from './rollup-plugins/stencil-manifest-to-imports';
import scss from './rollup-plugins/scss';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';


export async function generateComponentModules(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {

  if (canSkipBuild(config, ctx, manifestBundle.moduleFiles, manifestBundle.cacheKey)) {
    // don't bother bundling if this is a change build but
    // none of the changed files are modules or components
    manifestBundle.compiledModuleText = ctx.moduleBundleOutputs[manifestBundle.cacheKey];
    return Promise.resolve();
  }

  // start the bundler on our temporary file
  const code = await bundleComponents(config, ctx, manifestBundle);

  // module bundling finished, assign its content to the user's bundle
  // wrap our component code with our own iife
  manifestBundle.compiledModuleText = wrapComponentImports(code.trim());

  // replace build time expressions, like process.env.NODE_ENV === 'production'
  // with a hard coded boolean
  manifestBundle.compiledModuleText = buildExpressionReplacer(config, manifestBundle.compiledModuleText);

  // cache for later
  ctx.moduleBundleOutputs[manifestBundle.cacheKey] = manifestBundle.compiledModuleText;

  // keep track of module bundling for testing
  ctx.moduleBundleCount++;
}

async function bundleComponents(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  // start the bundler on our temporary file
  let rollupBundle;
  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: manifestBundle.cacheKey,
      external(id: string) {
        return ctx.graphData[id] != null;
      },
      plugins: [
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        scss({
          output: false
        }),
        stencilManifestsToInputs(manifestBundle),
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

  // generate the bundler results
  const { code } = await rollupBundle.generate({
    format: 'es'
  });

  return code;
}


export function wrapComponentImports(content: string) {
  return `function importComponent(exports, h, t, Context, publicPath) {\n"use strict";\n${content}\n}`;
}

export function canSkipBuild(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFile[], cacheKey: string) {
  // must build if it's not a change build
  if (!ctx.isChangeBuild) {
    return false;
  }

  // cannot skip if there isn't anything cached
  if (!ctx.moduleBundleOutputs[cacheKey]) {
    return false;
  }

  // must rebuild if it's non-component changes
  // basically don't know of deps of deps changed, so play it safe
  if (ctx.changeHasNonComponentModules) {
    return false;
  }

  // ok to skip if it wasn't a component module change
  if (!ctx.changeHasComponentModules) {
    return true;
  }

  // check if this bundle has one of the changed files
  const bundleContainsChangedFile = bundledComponentContainsChangedFile(config, moduleFiles, ctx.changedFiles);
  if (!bundleContainsChangedFile) {
    // don't bother bundling, none of the changed files have the same filename
    return true;
  }

  // idk, probs need to bundle, can't skip
  return false;
}


export function bundledComponentContainsChangedFile(config: BuildConfig, bundlesModuleFiles: ModuleFile[], changedFiles: string[]) {
  // loop through all the changed typescript filenames and see if there are corresponding js filenames
  // if there are no filenames that match then let's not bundle
  // yes...there could be two files that have the same filename in different directories
  // but worst case scenario is that both of them run their bundling, which isn't a performance problem
  return bundlesModuleFiles.some(moduleFile => {
    const distFileName = config.sys.path.basename(moduleFile.jsFilePath, '.js');
    return changedFiles.some(f => {
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });
  });
}
