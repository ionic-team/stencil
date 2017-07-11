import { ComponentMeta, ComponentOptions, BuildConfig, BuildContext, Manifest, Diagnostic } from '../interfaces';

export interface AssetsResults {
  bundles: {
    [bundleId: string]: {
      [modeName: string]: string;
    };
  };
  diagnostics: Diagnostic[];
}


export const COMPONENT_OPTIONS_LIST = ['assetsDir', 'assetsDirs'];

export function parseComponentMetadata({ assetsDir, assetsDirs }: ComponentOptions, cmpMeta: ComponentMeta)  {
  cmpMeta.assetsDirsMeta = [];
  if (assetsDir) {
    cmpMeta.assetsDirsMeta = [assetsDir];
  }
  if (assetsDirs) {
    cmpMeta.assetsDirsMeta = assetsDirs;
  }
}

export function bundleAssets(buildConfig: BuildConfig, ctx: BuildContext, userManifest: Manifest): Promise<AssetsResults> {
  const assetsResults: AssetsResults = {
    bundles: {},
    diagnostics: []
  };

  const doBundling = (!ctx.isChangeBuild);

  const timeSpan = buildConfig.logger.createTimeSpan(`bundle assets started`, !doBundling);

  const directoriesToCopy: string[] = userManifest.components.reduce((dirList, component) => {
    const qualifiedPathDirs: string[] = component.assetsDirsMeta.map((dir: string) => {
      const relativeCompUrl = buildConfig.sys.path.relative(buildConfig.collectionDest, component.componentUrl);
      return buildConfig.sys.path.resolve(buildConfig.src, relativeCompUrl, dir);
    });

    return dirList.concat(qualifiedPathDirs);
  }, <string[]>[]);

  const dirCopyPromises = directoriesToCopy.map((directory: string) => {
    return new Promise((resolve, reject) => {
      const destination = buildConfig.sys.path.join(buildConfig.collectionDest, buildConfig.sys.path.basename(directory));
      buildConfig.sys.copyDir(directory, destination, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });

  // console.log(ctx.changedFiles);

  return Promise.all(dirCopyPromises).then(function() {
    timeSpan.finish('bundle styles finished');
    return assetsResults;
  });
}
