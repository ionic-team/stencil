import * as d from '../../../declarations';
import { catchError } from '@utils';
import { isOutputTargetDistCustomElements } from '../../../compiler/output-targets/output-utils';
import { nativeComponentTransform } from '../../../compiler/transformers/component-native/tranform-to-native-component';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_CLIENT_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { join, relative } from 'path';
import ts from 'typescript';


export const outputCustomElements = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate custom elements started`, true);
  const printer = ts.createPrinter();
  try {
    await Promise.all(changedModuleFiles.map(async mod => {
      const transformResults = ts.transform(mod.staticSourceFile, getCustomTransformer(config, compilerCtx));
      const transformed = transformResults.transformed[0];
      const code = printer.printFile(transformed);

      await Promise.all(outputTargets.map(async o => {
        const relPath = relative(config.srcDir, mod.jsFilePath);
        const filePath = join(o.dir, relPath);
        await compilerCtx.fs.writeFile(filePath, code, { outputTargetType: o.type });
      }));
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom elements finished`);
};


const getCustomTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.cwd,
    module: 'esm',
    proxy: null,
    style: 'static',
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    nativeComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
