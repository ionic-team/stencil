import * as d from '../../declarations';
import { buildError, buildJsonFileError } from '@utils';
import { isOutputTargetWww } from '../output-targets/output-utils';


export function validateManifestJson(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (config.devMode) {
    return null;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetWww);

  return Promise.all(outputTargets.map(async outputsTarget => {
    const manifestFilePath = config.sys.path.join(outputsTarget.dir, 'manifest.json');

    try {
      const manifestContent = await compilerCtx.fs.readFile(manifestFilePath);

      try {
        const manifestData = JSON.parse(manifestContent);
        await validateManifestJsonData(config, compilerCtx, buildCtx, manifestFilePath, manifestData);

      } catch (e) {
        const err = buildError(buildCtx.diagnostics);
        err.header = `Invalid manifest.json`;
        err.absFilePath = manifestFilePath;
      }

    } catch (e) {}
  }));
}


async function validateManifestJsonData(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, manifestFilePath: string, manifestData: any) {
  if (Array.isArray(manifestData.icons)) {
    await Promise.all(manifestData.icons.map((manifestIcon: any) => {
      return validateManifestJsonIcon(config, compilerCtx, buildCtx, manifestFilePath, manifestIcon);
    }));
  }
}


async function validateManifestJsonIcon(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, manifestFilePath: string, manifestIcon: any) {
  let iconSrc = manifestIcon.src;
  if (typeof iconSrc !== 'string') {
    const msg = `Manifest icon missing "src"`;
    buildJsonFileError(compilerCtx, buildCtx.diagnostics, manifestFilePath, msg, `"icons"`);
    return;
  }

  if (iconSrc.startsWith('/')) {
    iconSrc = iconSrc.substr(1);
  }

  const manifestDir = config.sys.path.dirname(manifestFilePath);
  const iconPath = config.sys.path.join(manifestDir, iconSrc);
  const hasAccess = await compilerCtx.fs.access(iconPath);
  if (!hasAccess) {
    const msg = `Unable to find manifest icon "${manifestIcon.src}"`;
    buildJsonFileError(compilerCtx, buildCtx.diagnostics, manifestFilePath, msg, `"${manifestIcon.src}"`);
  }
}
