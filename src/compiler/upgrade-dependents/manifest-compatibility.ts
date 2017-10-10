import { BuildConfig, Manifest } from '../../util/interfaces';


export function validateManifestCompatibility(config: BuildConfig, manifest: Manifest): number[] {
  if (!manifest.compiler) {
    // if there is no compiler data at all then this was probably
    // set on purpose and we should avoid doing any upgrading
    return [];
  }

  try {
    // fill in any default data if somehow it's missing entirely
    manifest.compiler.name = manifest.compiler.name || '@stencil/core';
    manifest.compiler.version = manifest.compiler.version || '0.0.1';
    manifest.compiler.typescriptVersion = manifest.compiler.typescriptVersion || '2.5.3';

    // parse version
    const manifestCompilerVersion = parseCompilerVersion(manifest.compiler.version);

    // figure out which compiler upgrades, if any, we need to do
    return calculateRequiredUpgrades(manifestCompilerVersion);


  } catch (e) {
    config.logger.error(`error parsing compiler version: ${e}`);
  }

  return [];
}


export function calculateRequiredUpgrades(v: Semver) {
  // CUSTOM CHECKS PER KNOWN BREAKING CHANGES
  // UNIT TEST UNIT TEST UNIT TEST
  const upgrades: CompilerUpgrade[] = [];

  if (semverLessThan(v, '0.0.6-11')) {
    // 2017-10-04
    // between 0.0.5 and 0.0.6-11 we no longer have a custom JSX parser
    upgrades.push(CompilerUpgrade.JSX_Upgrade_From_0_0_5);
  }

  return upgrades;
}


export function parseCompilerVersion(version: string): Semver {
  const dashSplt = version.split('-');
  const dotSplt = dashSplt[0].split('.');

  if (dotSplt.length !== 3) {
    throw new Error(`invalid semver: ${version}`);
  }

  const semver: Semver = {
    major: parseInt(dotSplt[0], 10),
    minor: parseInt(dotSplt[1], 10),
    patch: parseInt(dotSplt[2], 10)
  };

  const prereleaseSplt = dashSplt.slice(1);
  if (prereleaseSplt.length > 1) {
    throw new Error(`invalid semver: ${version}`);
  }
  if (prereleaseSplt.length === 1) {
    const prerelease = parseInt(prereleaseSplt[0], 10);
    if (isNaN(prerelease)) {
      throw new Error(`invalid semver: ${version}`);
    } else {
      semver.prerelease = prerelease;
    }
  }

  return semver;
}

export function semverLessThan(a: Semver | string, b: Semver | string): boolean {
  const semverA = (typeof a === 'string') ? parseCompilerVersion(a) : a;
  const semverB = (typeof b === 'string') ? parseCompilerVersion(b) : b;

  if (semverA.major < semverB.major) {
    return true;
  }
  if (semverA.major > semverB.major) {
    return false;
  }

  // Assume major are equal
  if (semverA.minor < semverB.minor) {
    return true;
  }
  if (semverA.minor > semverB.minor) {
    return false;
  }

  // Assume major.minor are equal
  if (semverA.patch < semverB.patch) {
    return true;
  }
  if (semverA.patch > semverB.patch) {
    return false;
  }

  // Assume major.minor.patch are equal
  if (semverA.prerelease != null && semverB.prerelease == null) {
    return true;
  }
  if (semverA.prerelease != null && semverB.prerelease != null) {
    if (semverA.prerelease < semverB.prerelease) {
      return true;
    }
    if (semverA.prerelease > semverB.prerelease) {
      return false;
    }
  }

  // Asume major.minor.patch.prerelease are equal
  return false;
}


export interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease?: number;
}


export const enum CompilerUpgrade {
  JSX_Upgrade_From_0_0_5
}
