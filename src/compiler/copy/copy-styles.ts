import * as d from '../../declarations';
import { catchError } from '../util';


export async function copyComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {

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

    const promises: Promise<any>[] = [];

    const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);

    absSrcStylePaths.map(async absSrcStylePath => {
      outputTargets.forEach(outputTarget => {
        const relPath = config.sys.path.relative(config.srcDir, absSrcStylePath);
        const dest = config.sys.path.join(outputTarget.collectionDir, relPath);
        promises.push(compilerCtx.fs.copy(absSrcStylePath, dest));
      });
    });

    await Promise.all(promises);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}
