import * as d from '@declarations';
import { catchError } from '@utils';
import { sys } from '@sys';
import { MockDocument, serializeNodeToHtml } from '@mock-doc';
import { updateIndexHtmlServiceWorker } from '../service-worker/inject-sw-script';


export async function outputIndexHtmls(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.srcIndexHtml) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => {
    return o.indexHtml;
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate index.html started`, true);

  const promises = outputTargets.map(outputTarget => {
    return generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate index.html finished`);
}


async function generateIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (buildCtx.shouldAbort) {
    return;
  }

  if (compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0 && !buildCtx.hasIndexHtmlChanges) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    let indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
    try {
      indexSrcHtml = await updateModulePreload(config, compilerCtx, outputTarget, indexSrcHtml);
      indexSrcHtml = await updateIndexHtmlServiceWorker(config, buildCtx, outputTarget, indexSrcHtml);

      await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexSrcHtml);

      buildCtx.debug(`generateIndexHtml, write: ${sys.path.relative(config.rootDir, outputTarget.indexHtml)}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    buildCtx.debug(`no index html: ${config.srcIndexHtml}`);
  }
}

export async function updateModulePreload(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, indexSrcHtml: string) {
  const doc = new MockDocument(indexSrcHtml);
  const expectedSrc = `build/${config.fsNamespace}.mjs.js`;
  const script = Array.from(doc.querySelectorAll('script'))
    .find(s => s.getAttribute('type') === 'module' && s.getAttribute('src') === expectedSrc);

  if (!script) {
    return indexSrcHtml;
  }

  let content = await compilerCtx.fs.readFile(sys.path.join(outputTarget.dir, expectedSrc));
  const result = content.match(/import.*from\s*'(.*)';/);
  if (!result) {
    return indexSrcHtml;
  }
  const corePath = result[1];
  const newPath = sys.path.join(
    sys.path.dirname(expectedSrc),
    corePath
  );
  content = content.replace(corePath, './' + newPath);

  // insert modulepreload
  script.parentNode.insertBefore(
    createModulePreload(doc, newPath),
    script
  );

  // insert inline script
  const inlinedScript = doc.createElement('script');
  inlinedScript.setAttribute('type', 'module');
  inlinedScript.textContent = content;
  script.parentNode.insertBefore(
    inlinedScript,
    script
  );

  // remove original script
  script.remove();

  return serializeNodeToHtml(doc);
}

function createModulePreload(doc: MockDocument, href: string) {
  const link = doc.createElement('link');
  link.setAttribute('rel', 'modulepreload');
  link.setAttribute('href', href);
  return link;
}
