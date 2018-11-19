import * as d from '../../declarations';
import { catchError } from '../util';
import { CompilerUpgrade, validateCollectionCompatibility } from './collection-compatibility';
import { componentDependencies } from '../transpile/transformers/component-dependencies';
import { removeStencilImports } from '../transpile/transformers/remove-stencil-imports';
import { transformSourceString } from '../transpile/transformers/util';
import upgradeFrom0_0_5 from '../transpile/transformers/JSX_Upgrade_From_0_0_5/upgrade-jsx-props';
import upgradeFromMetadata from '../transpile/transformers/Metadata_Upgrade_From_0_1_0/metadata-upgrade';
import ts from 'typescript';


export async function upgradeCollection(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collection: d.Collection) {
  try {
    const upgradeTransforms = validateCollectionCompatibility(config, collection);

    if (upgradeTransforms.length === 0) {
      return;
    }

    const timeSpan = buildCtx.createTimeSpan(`upgrade ${collection.collectionName} started`, true);

    const doUpgrade = createDoUpgrade(compilerCtx, buildCtx);

    await doUpgrade(collection, upgradeTransforms);

    timeSpan.finish(`upgrade ${collection.collectionName} finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


function createDoUpgrade(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {

  return async (collection: d.Collection, upgrades: CompilerUpgrade[]): Promise<void> => {
    const upgradeTransforms: ts.TransformerFactory<ts.SourceFile>[] = (upgrades.map((upgrade) => {
      switch (upgrade) {
        case CompilerUpgrade.JSX_Upgrade_From_0_0_5:
        buildCtx.debug(`JSX_Upgrade_From_0_0_5, ${collection.collectionName}, compiled by v${collection.compiler.version}`);
          return upgradeFrom0_0_5 as ts.TransformerFactory<ts.SourceFile>;

        case CompilerUpgrade.Metadata_Upgrade_From_0_1_0:
        buildCtx.debug(`Metadata_Upgrade_From_0_1_0, ${collection.collectionName}, compiled by v${collection.compiler.version}`);
          return () => {
            return upgradeFromMetadata(compilerCtx.moduleFiles);
          };

        case CompilerUpgrade.Remove_Stencil_Imports:
        buildCtx.debug(`Remove_Stencil_Imports, ${collection.collectionName}, compiled by v${collection.compiler.version}`);
          return (transformContext: ts.TransformationContext) => {
            return removeStencilImports()(transformContext);
          };

        case CompilerUpgrade.Add_Component_Dependencies:
        buildCtx.debug(`Add_Component_Dependencies, ${collection.collectionName}, compiled by v${collection.compiler.version}`);
          return (transformContext: ts.TransformationContext) => {
            return componentDependencies(compilerCtx)(transformContext);
          };
      }
      return () => (tsSourceFile: ts.SourceFile) => (tsSourceFile);
    }));

    await Promise.all(collection.moduleFiles.map(async moduleFile => {
      try {
        const source = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
        const output = await transformSourceString(moduleFile.jsFilePath, source, upgradeTransforms);
        await compilerCtx.fs.writeFile(moduleFile.jsFilePath, output, { inMemoryOnly: true });

      } catch (e) {
        catchError(buildCtx.diagnostics, e, `error performing compiler upgrade on ${moduleFile.jsFilePath}: ${e}`);
      }
    }));
  };
}
