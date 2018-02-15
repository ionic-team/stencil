import { CompilerCtx, Config, CopyTask, ModuleFile } from '../../declarations';
import { COLLECTION_DEPENDENCIES_DIR } from './collection-data';


export async function copySourceCollectionComponentsToDistribution(config: Config, compilerCtx: CompilerCtx, modulesFiles: ModuleFile[]) {
  // for any components that are dependencies, such as ionicons is a dependency of ionic
  // then we need to copy the dependency to the dist so it just works downstream

  const copyTasks: CopyTask[] = [];

  const collectionModules = modulesFiles.filter(m => m.isCollectionDependency && m.originalCollectionComponentPath);

  collectionModules.forEach(m => {
    copyTasks.push({
      src: m.jsFilePath,
      dest: config.sys.path.join(
        config.collectionDir,
        COLLECTION_DEPENDENCIES_DIR,
        m.originalCollectionComponentPath
      )
    });

    if (m.cmpMeta && m.cmpMeta.stylesMeta) {
      const modeNames = Object.keys(m.cmpMeta.stylesMeta);
      modeNames.forEach(modeName => {
        const styleMeta = m.cmpMeta.stylesMeta[modeName];

        if (styleMeta.externalStyles) {
          styleMeta.externalStyles.forEach(externalStyle => {
            copyTasks.push({
              src: externalStyle.absolutePath,
              dest: config.sys.path.join(
                config.collectionDir,
                COLLECTION_DEPENDENCIES_DIR,
                externalStyle.originalCollectionPath
              )
            });
          });
        }
      });
    }

  });

  await Promise.all(copyTasks.map(async copyTask => {
    await compilerCtx.fs.copy(copyTask.src, copyTask.dest);
  }));
}
