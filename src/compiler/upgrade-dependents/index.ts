import { BuildConfig, BuildContext, Manifest } from '../../util/interfaces';
import { validateManifestCompatibility, CompilerUpgrade } from './manifest-compatibility';
import { transformSourceString } from '../transpile/transformers/util';
import * as util from 'util';
import upgradeFrom0_0_5 from '../transpile/transformers/JSX_Upgrade_From_0_0_5/upgrade-jsx-props';
import ts from 'typescript';

require('util.promisify').shim();


export async function upgradeDependentComponents(config: BuildConfig, ctx: BuildContext) {

  const fsReadFilePr = util.promisify(config.sys.fs.readFile);
  const doUpgrade = createDoUpgrade(config, ctx, fsReadFilePr);

  return Promise.all(Object.keys(ctx.dependentManifests).map(async function(collectionName) {
    const manifest = ctx.dependentManifests[collectionName];
    const upgrades = validateManifestCompatibility(config, manifest);

    try {
      await doUpgrade(manifest, upgrades);
    } catch (e) {
      config.logger.error(`error performing compiler upgrade: ${e}`);
    }
  }));
}


function createDoUpgrade(config: BuildConfig, ctx: BuildContext, fsReadFilePr: (...args: any[]) => Promise<any>) {

  return async (manifest: Manifest, upgrades: CompilerUpgrade[]): Promise<void> => {
    const upgradeTransforms: ts.TransformerFactory<ts.SourceFile>[] = (upgrades.map((upgrade) => {
      switch (upgrade) {
        case CompilerUpgrade.JSX_Upgrade_From_0_0_5:
          config.logger.info(`JSX_Upgrade_From_0_0_5, manifestCompilerVersion: ${manifest.compiler.version}`);
          return upgradeFrom0_0_5 as ts.TransformerFactory<ts.SourceFile>;
      }
      return () => (tsSourceFile: ts.SourceFile) => (tsSourceFile);
    }));

    if (upgradeTransforms.length === 0) {
      return;
    }

    await Promise.all(manifest.modulesFiles.map(async function(moduleFile) {

      const source = await fsReadFilePr(moduleFile.jsFilePath, 'utf8');
      const output = transformSourceString(source, upgradeTransforms);
      ctx.jsFiles[moduleFile.jsFilePath] = output;
    }));
  };
}
