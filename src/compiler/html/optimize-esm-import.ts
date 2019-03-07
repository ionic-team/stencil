import * as d from '@declarations';
import { sys } from '@sys';


export async function optimizeEsmLoaderImport(doc: Document, config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  const expectedSrc = `build/${config.fsNamespace}.mjs.js`;
  const script = Array.from(doc.querySelectorAll('script'))
    .find(s => s.getAttribute('type') === 'module' && s.getAttribute('src') === expectedSrc);

  if (!script) {
    return;
  }

  let content = await compilerCtx.fs.readFile(sys.path.join(outputTarget.dir, expectedSrc));
  const result = content.match(/import.*from\s*(?:'|")(.*)(?:'|");/);
  if (!result) {
    return;
  }
  const corePath = result[1];
  const newPath = sys.path.join(
    sys.path.dirname(expectedSrc),
    corePath
  );
  content = content.replace(corePath, newPath[0] === '.' ? newPath : './' + newPath);

  // insert modulepreload
  script.parentNode.insertBefore(
    createModulePreload(doc, newPath),
    script
  );

  // insert inline script
  const inlinedScript = doc.createElement('script');
  inlinedScript.setAttribute('type', 'module');
  inlinedScript.innerHTML = content;
  script.parentNode.insertBefore(
    inlinedScript,
    script
  );

  // remove original script
  script.remove();
}

function createModulePreload(doc: Document, href: string) {
  const link = doc.createElement('link');
  link.setAttribute('rel', 'modulepreload');
  link.setAttribute('href', href);
  return link;
}

