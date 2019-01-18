import * as d from '@declarations';
import { buildError } from '@stencil/core/utils';


export function processAppGraph(buildCtx: d.BuildCtx, allModules: d.Module[], entryTags: string[]) {
  const graph = getGraph(buildCtx, allModules, entryTags);

  const entryPoints: d.EntryPoint[] = [];

  for (const graphEntry of graph) {
    if (entryPoints.some(en => en.some(ec => ec.tag === graphEntry.tag))) {
      // already handled this one
      continue;
    }

    const depsOf = graph.filter(d => d.dependencies.includes(graphEntry.tag));
    if (depsOf.length > 1) {
      const commonEntryCmps: d.EntryComponent[] = [];

      depsOf.forEach(depOf => {
        depOf.dependencies.forEach(depTag => {

          if (depsOf.every(d => d.dependencies.includes(depTag))) {
            const existingCommonEntryCmp = commonEntryCmps.find(ec => {
              return ec.tag === depTag;
            });

            if (existingCommonEntryCmp) {
              existingCommonEntryCmp.dependencyOf.push(depOf.tag);

            } else {
              commonEntryCmps.push({
                tag: depTag,
                dependencyOf: [depOf.tag]
              });
            }
          }
        });
      });

      const existingEntryPoint = entryPoints.find(ep => {
        return ep.some(ec => commonEntryCmps.some(cec => cec.tag === ec.tag));
      });

      if (existingEntryPoint) {
        const depsOf = graph.filter(d => d.dependencies.includes(graphEntry.tag));
        if (depsOf.length > 0) {
          const existingEntryPointDepOf = entryPoints.find(ep => ep.some(ec => depsOf.some(d => d.dependencies.includes(ec.tag))));

          if (existingEntryPointDepOf) {
            existingEntryPointDepOf.push({
              tag: graphEntry.tag,
              dependencyOf: depsOf.map(d => d.tag)
            });

          } else {
            entryPoints.push([
              {
                tag: graphEntry.tag,
                dependencyOf: []
              }
            ]);
          }

        } else {
          entryPoints.push([
            {
              tag: graphEntry.tag,
              dependencyOf: []
            }
          ]);
        }

      } else {
        entryPoints.push(commonEntryCmps);
      }

    } else if (depsOf.length === 1) {
      const existingEntryPoint = entryPoints.find(ep => ep.some(ec => ec.tag === depsOf[0].tag));
      if (existingEntryPoint) {
        existingEntryPoint.push({
          tag: graphEntry.tag,
          dependencyOf: [depsOf[0].tag]
        });

      } else {
        entryPoints.push([
          {
            tag: depsOf[0].tag,
            dependencyOf: []
          },
          {
            tag: graphEntry.tag,
            dependencyOf: [depsOf[0].tag]
          }
        ]);
      }

    } else {
      entryPoints.push([
        {
          tag: graphEntry.tag,
          dependencyOf: []
        }
      ]);
    }
  }

  entryPoints.forEach(entryPoint => {
    entryPoint.forEach(entryCmp => {
      entryCmp.dependencyOf.sort();
    });

    entryPoint.sort((a, b) => {
      if (a.tag < b.tag) return -1;
      if (a.tag > b.tag) return 1;
      return 0;
    });
  });

  entryPoints.sort((a, b) => {
    if (a[0].tag < b[0].tag) return -1;
    if (a[0].tag > b[0].tag) return 1;
    return 0;
  });

  return entryPoints;
}


function getGraph(buildCtx: d.BuildCtx, allModules: d.Module[], entryTags: string[]) {
  const graph: { tag: string; dependencies: string[]; }[] = [];

  function addDeps(tag: string) {
    if (graph.some(d => d.tag === tag)) {
      return;
    }

    const m = allModules.find(m => m.cmpCompilerMeta && m.cmpCompilerMeta.tagName === tag);
    if (!m) {
      const diagnostic = buildError(buildCtx.diagnostics);
      diagnostic.messageText = `unable to find tag "${tag}" while generating component graph`;
      return;
    }
    m.cmpCompilerMeta.dependencies = (m.cmpCompilerMeta.dependencies || []);

    const dependencies = m.cmpCompilerMeta.dependencies.filter(t => t !== tag).sort();

    graph.push({
      tag: tag,
      dependencies: dependencies
    });

    dependencies.forEach(addDeps);
  }

  entryTags.forEach(addDeps);

  return graph;
}
