import { Config, CompilerCtx, Manifest, Bundle, BuildCtx } from '../../util/interfaces';
import { CompilerUpgrade, validateManifestCompatibility } from './manifest-compatibility';
import { transformSourceString } from '../transpile/transformers/util';
import upgradeFrom0_0_5 from '../transpile/transformers/JSX_Upgrade_From_0_0_5/upgrade-jsx-props';
import upgradeFromMetadata from '../transpile/transformers/Metadata_Upgrade_From_0_1_0/metadata-upgrade';
import ts from 'typescript';


export async function upgradeDependentComponents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[]) {
  if (!buildCtx.requiresFullBuild) {
    // if this doesn't require a full build then no need to do it again
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`upgradeDependentComponents started`, true);

  const doUpgrade = createDoUpgrade(config, compilerCtx, bundles);

  await Promise.all(Object.keys(compilerCtx.dependentManifests).map(async collectionName => {
    const manifest = compilerCtx.dependentManifests[collectionName];
    const upgrades = validateManifestCompatibility(config, manifest);

    try {
      await doUpgrade(manifest, upgrades);
    } catch (e) {
      config.logger.error(`error performing compiler upgrade: ${e}`);
    }
  }));

  timeSpan.finish(`upgradeDependentComponents finished`);
}


function createDoUpgrade(config: Config, compilerCtx: CompilerCtx, bundles: Bundle[]) {

  return async (manifest: Manifest, upgrades: CompilerUpgrade[]): Promise<void> => {
    const upgradeTransforms: ts.TransformerFactory<ts.SourceFile>[] = (upgrades.map((upgrade) => {
      switch (upgrade) {
        case CompilerUpgrade.JSX_Upgrade_From_0_0_5:
          config.logger.debug(`JSX_Upgrade_From_0_0_5, manifestCompilerVersion: ${manifest.compiler.version}`);
          return upgradeFrom0_0_5 as ts.TransformerFactory<ts.SourceFile>;

        case CompilerUpgrade.Metadata_Upgrade_From_0_1_0:
          config.logger.debug(`Metadata_Upgrade_From_0_1_0, manifestCompilerVersion: ${manifest.compiler.version}`);
          return () => {
            return upgradeFromMetadata(bundles);
          };
      }
      return () => (tsSourceFile: ts.SourceFile) => (tsSourceFile);
    }));

    if (upgradeTransforms.length === 0) {
      return;
    }

    await Promise.all(manifest.modulesFiles.map(async moduleFile => {

      try {
        const source = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
        const output = await transformSourceString(moduleFile.jsFilePath, source, upgradeTransforms);
        await compilerCtx.fs.writeFile(moduleFile.jsFilePath, output, { inMemoryOnly: true });

      } catch (e) {
        config.logger.error(`error performing compiler upgrade on ${moduleFile.jsFilePath}: ${e}`);
      }

    }));
  };
}
