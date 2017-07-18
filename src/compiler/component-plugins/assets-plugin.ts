import { BuildConfig, ComponentMeta, ComponentOptions, Manifest } from '../interfaces';


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

export function copyAssets(config: BuildConfig, userManifest: Manifest) {
  const timeSpan = config.logger.createTimeSpan(`copy assets started`, true);

  const directoriesToCopy: string[] = userManifest.components
    .filter(c => c.assetsDirsMeta && c.assetsDirsMeta.length)
    .reduce((dirList, component) => {
      const qualifiedPathDirs: string[] = component.assetsDirsMeta.map((dir: string) => {
        const relativeCompUrl = config.sys.path.dirname(
          config.sys.path.relative(config.collectionDir, component.componentPath)
        );
        return config.sys.path.resolve(config.src, relativeCompUrl, dir);
      });

      return dirList.concat(qualifiedPathDirs);
    }, <string[]>[]);

  const dirCopyPromises = directoriesToCopy.map((directory: string) => {
    return new Promise((resolve, reject) => {
      const destination = config.sys.path.join(config.collectionDir, config.sys.path.basename(directory));
      config.sys.copyDir(directory, destination, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });

  return Promise.all(dirCopyPromises).then(function() {
    timeSpan.finish('copy assets finished');
  });
}
