import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { catchError } from '../util';


export async function copyComponentStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  config.logger.debug(`copy styles`);

  try {
    const absSrcStylePaths: string[] = [];

    buildCtx.entryModules.forEach(entryModule => {
      const cmps = entryModule.moduleFiles.filter(m => m.cmpMeta.stylesMeta);

      cmps.forEach(c => {
        if (c.isCollectionDependency) {
          return;
        }

        Object.keys(c.cmpMeta.stylesMeta).forEach(modeName => {
          const styleMeta = c.cmpMeta.stylesMeta[modeName];

          if (styleMeta.externalStyles) {
            styleMeta.externalStyles.forEach(externalStyle => {
              absSrcStylePaths.push(externalStyle.absolutePath);
            });
          }
        });
      });
    });

    await Promise.all(absSrcStylePaths.map(async absSrcStylePath => {
      const relPath = config.sys.path.relative(config.srcDir, absSrcStylePath);
      const dest = config.sys.path.join(config.outputTargets['distribution'].collectionDir, relPath);

      await compilerCtx.fs.copy(absSrcStylePath, dest);
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}
