import * as d from '@declarations';
import { catchError } from '@utils';


export async function copyComponentStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.collectionDir);
  if (outputTargets.length === 0) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`copyComponentStyles started`, true);

  try {
    const absSrcStylePaths: string[] = [];

    buildCtx.entryModules.forEach(entryModule => {
      const cmps = entryModule.moduleFiles.filter(m => m.cmpCompilerMeta.styles);

      cmps.forEach(c => {
        if (c.isCollectionDependency) {
          return;
        }

        c.cmpCompilerMeta.styles.forEach(styleMeta => {
          if (styleMeta.externalStyles) {
            styleMeta.externalStyles.forEach(externalStyle => {
              absSrcStylePaths.push(externalStyle.absolutePath);
            });
          }
        });
      });
    });

    await Promise.all(absSrcStylePaths.map(async absSrcStylePath => {
      await Promise.all(outputTargets.map(async outputTarget => {
        const relPath = config.sys.path.relative(config.srcDir, absSrcStylePath);
        const absDestStylePath = config.sys.path.join(outputTarget.collectionDir, relPath);

        const content = await compilerCtx.fs.readFile(absSrcStylePath);
        await compilerCtx.fs.writeFile(absDestStylePath, content);
      }));
    }));

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`copyComponentStyles finished`);
}
