import { BuildConfig, Manifest } from '../../util/interfaces';


export function validateManifestCompatibility(config: BuildConfig, manifestDir: string, manifest: Manifest) {
  if (!manifest.compiler) {
    // if there is no compiler data at all then this was probably
    // set on purpose and we should avoid doing any upgrading
    return;
  }

  try {
    // fill in any default data if somehow it's missing entirely
    manifest.compiler.name = manifest.compiler.name || '@stencil/core';
    manifest.compiler.version = manifest.compiler.version || '0.0.1';
    manifest.compiler.typescriptVersion = manifest.compiler.typescriptVersion || '2.5.3';

    // parse version
    const manifestCompilerVersion = parseCompilerVersion(manifest.compiler.version);

    // figure out which compiler upgrades, if any, we need to do
    const upgrades = calculateRequiredUpgrades(manifestCompilerVersion);

    upgrades.forEach(upgrade => {
      try {
        // let's do this!
        doUpgrade(config, manifestDir, manifestCompilerVersion, upgrade);

      } catch (e) {
        config.logger.error(`error performing compiler upgrade: ${e}`);
      }
    });

  } catch (e) {
    config.logger.error(`error parsing compiler version: ${e}`);
  }
}


export function calculateRequiredUpgrades(v: Semver) {
  // CUSTOM CHECKS PER KNOWN BREAKING CHANGES
  // UNIT TEST UNIT TEST UNIT TEST
  const upgrades: CompilerUpgrade[] = [];

  if (v.major === 0 && v.minor === 0 && (v.patch < 6 || (v.patch === 6 && (v.prerelease > 0 && v.prerelease < 11)))) {
    // 2017-10-04
    // between 0.0.5 and 0.0.6-11 we no longer have a custom JSX parser
    upgrades.push(CompilerUpgrade.JSX_Upgrade_From_0_0_5);
  }

  return upgrades;
}


function doUpgrade(config: BuildConfig, manifestDir: string, manifestCompilerVersion: Semver, upgrade: CompilerUpgrade) {

  switch (upgrade) {
    case CompilerUpgrade.JSX_Upgrade_From_0_0_5:
      config.logger.debug(`JSX_Upgrade_From_0_0_5, manifestDir: ${manifestDir}, manifestCompilerVersion: ${manifestCompilerVersion}`);
      break;
  }

}


export function parseCompilerVersion(version: string): Semver {
  const dashSplt = version.split('-');
  const dotSplt = dashSplt[0].split('.');

  if (dotSplt.length !== 3) {
    throw new Error(`invalid semver: ${version}`);
  }

  const major = parseInt(dotSplt[0], 10);
  const minor = parseInt(dotSplt[1], 10);
  const patch = parseInt(dotSplt[2], 10);
  let prerelease = 0;

  const prereleaseSplt = dashSplt.slice(1);
  if (prereleaseSplt.length > 1) {
    throw new Error(`invalid semver: ${version}`);
  }
  if (prereleaseSplt.length === 1) {
    prerelease = parseInt(prereleaseSplt[0], 10);
    if (isNaN(prerelease)) {
      throw new Error(`invalid semver: ${version}`);
    }
  }

  return  { major, minor, patch, prerelease };
}


export interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease: number;
}


export const enum CompilerUpgrade {
  JSX_Upgrade_From_0_0_5
}
