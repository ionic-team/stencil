import { BuildCtx, CompilerCtx, Config, Manifest } from '../../declarations';
import { CompilerUpgrade, validateManifestCompatibility } from './manifest-compatibility';
import { componentDependencies } from '../transpile/transformers/component-dependencies';
import { removeStencilImports } from '../transpile/transformers/remove-stencil-imports';
import { transformSourceString } from '../transpile/transformers/util';
import upgradeFrom0_0_5 from '../transpile/transformers/JSX_Upgrade_From_0_0_5/upgrade-jsx-props';
import upgradeFromMetadata from '../transpile/transformers/Metadata_Upgrade_From_0_1_0/metadata-upgrade';
import ts from 'typescript';
import { catchError } from '../util';


export async function upgradeCollection(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, manifest: Manifest) {
  try {
    const upgradeTransforms = validateManifestCompatibility(config, manifest);

    if (upgradeTransforms.length === 0) {
      return;
    }

    const timeSpan = config.logger.createTimeSpan(`upgrade ${manifest.collectionName} started`, true);

    const doUpgrade = createDoUpgrade(config, compilerCtx, buildCtx);

    await doUpgrade(manifest, upgradeTransforms);

    timeSpan.finish(`upgrade ${manifest.collectionName} finished`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


function createDoUpgrade(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  return async (manifest: Manifest, upgrades: CompilerUpgrade[]): Promise<void> => {
    const upgradeTransforms: ts.TransformerFactory<ts.SourceFile>[] = (upgrades.map((upgrade) => {
      switch (upgrade) {
        case CompilerUpgrade.JSX_Upgrade_From_0_0_5:
          config.logger.debug(`JSX_Upgrade_From_0_0_5, ${manifest.collectionName}, compiled by v${manifest.compiler.version}`);
          return upgradeFrom0_0_5 as ts.TransformerFactory<ts.SourceFile>;

        case CompilerUpgrade.Metadata_Upgrade_From_0_1_0:
          config.logger.debug(`Metadata_Upgrade_From_0_1_0, ${manifest.collectionName}, compiled by v${manifest.compiler.version}`);
          return () => {
            return upgradeFromMetadata(compilerCtx.moduleFiles);
          };

        case CompilerUpgrade.Remove_Stencil_Imports:
          config.logger.debug(`Remove_Stencil_Imports, ${manifest.collectionName}, compiled by v${manifest.compiler.version}`);
          return (transformContext: ts.TransformationContext) => {
            return removeStencilImports()(transformContext);
          };

        case CompilerUpgrade.Add_Component_Dependencies:
          config.logger.debug(`Add_Component_Dependencies, ${manifest.collectionName}, compiled by v${manifest.compiler.version}`);
          return (transformContext: ts.TransformationContext) => {
            return componentDependencies(compilerCtx.moduleFiles)(transformContext);
          };
      }
      return () => (tsSourceFile: ts.SourceFile) => (tsSourceFile);
    }));

    await Promise.all(manifest.moduleFiles.map(async moduleFile => {
      try {
        const source = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
        const output = await transformSourceString(moduleFile.jsFilePath, source, upgradeTransforms);
        await compilerCtx.fs.writeFile(moduleFile.jsFilePath, output, { inMemoryOnly: true });

      } catch (e) {
        const d = catchError(buildCtx.diagnostics, e);
        d.messageText = `error performing compiler upgrade on ${moduleFile.jsFilePath}: ${e}`;
      }
    }));
  };
}
