import * as d from '../../../declarations';
import { catchError } from '@utils';
import { isOutputTargetDistCustomElements } from '../output-utils';
import { nativeComponentTransform } from '../../transformers/component-native/tranform-to-native-component';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_CORE_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';
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
    await Promise.all(
      changedModuleFiles.map(async mod => {
        const transformResults = ts.transform(mod.staticSourceFile, getCustomElementTransformer(config, compilerCtx));
        const transformed = transformResults.transformed[0];
        const code = printer.printFile(transformed);

        await Promise.all(
          outputTargets.map(async o => {
            const relPath = relative(config.srcDir, mod.jsFilePath);
            const filePath = join(o.dir, relPath);
            await compilerCtx.fs.writeFile(filePath, code, { outputTargetType: o.type });
          }),
        );
      }),
    );
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate custom elements finished`);
};

const getCustomElementTransformer = (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_CORE_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.sys.getCurrentDirectory(),
    module: 'esm',
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };
  return [updateStencilCoreImports(transformOpts.coreImportPath), nativeComponentTransform(compilerCtx, transformOpts), removeCollectionImports(compilerCtx)];
};
