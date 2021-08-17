import type * as d from '../../declarations';
import { buildError, buildJsonFileError, getStencilCompilerContext } from '@utils';
import { dirname, join } from 'path';
import { isOutputTargetWww } from '../output-targets/output-utils';

export const validateManifestJson = (config: d.Config, buildCtx: d.BuildCtx) => {
  if (config.devMode) {
    return null;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetWww);

  return Promise.all(
    outputTargets.map(async (outputsTarget) => {
      const manifestFilePath = join(outputsTarget.dir, 'manifest.json');

      try {
        const manifestContent = await getStencilCompilerContext().fs.readFile(manifestFilePath);
        if (manifestContent) {
          try {
            const manifestData = JSON.parse(manifestContent);
            await validateManifestJsonData(buildCtx, manifestFilePath, manifestData);
          } catch (e) {
            const err = buildError(buildCtx.diagnostics);
            err.header = `Invalid manifest.json: ${e}`;
            err.absFilePath = manifestFilePath;
          }
        }
      } catch (e) {}
    })
  );
};

const validateManifestJsonData = async (buildCtx: d.BuildCtx, manifestFilePath: string, manifestData: any) => {
  if (Array.isArray(manifestData.icons)) {
    await Promise.all(
      manifestData.icons.map((manifestIcon: any) => {
        return validateManifestJsonIcon(buildCtx, manifestFilePath, manifestIcon);
      })
    );
  }
};

const validateManifestJsonIcon = async (buildCtx: d.BuildCtx, manifestFilePath: string, manifestIcon: any) => {
  let iconSrc = manifestIcon.src;
  if (typeof iconSrc !== 'string') {
    const msg = `Manifest icon missing "src"`;
    buildJsonFileError(buildCtx.diagnostics, manifestFilePath, msg, `"icons"`);
    return;
  }

  if (iconSrc.startsWith('/')) {
    iconSrc = iconSrc.substr(1);
  }

  const manifestDir = dirname(manifestFilePath);
  const iconPath = join(manifestDir, iconSrc);
  const hasAccess = await getStencilCompilerContext().fs.access(iconPath);
  if (!hasAccess) {
    const msg = `Unable to find manifest icon "${manifestIcon.src}"`;
    buildJsonFileError(buildCtx.diagnostics, manifestFilePath, msg, `"${manifestIcon.src}"`);
  }
};
