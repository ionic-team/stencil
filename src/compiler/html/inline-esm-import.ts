import * as d from '../../declarations';
import { getAbsoluteBuildDir } from './utils';


export async function inlineEsmImport(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, outputTarget: d.OutputTargetWww) {
  const buildDir = getAbsoluteBuildDir(config, outputTarget);
  const filename = `${config.fsNamespace}.esm.js`;
  const expectedSrc = config.sys.path.join(buildDir, filename);
  const script = Array.from(doc.querySelectorAll('script'))
    .find(s => s.getAttribute('type') === 'module' && s.getAttribute('src') === expectedSrc);

  if (!script) {
    return;
  }

  let content = await compilerCtx.fs.readFile(config.sys.path.join(outputTarget.buildDir, filename));
  const result = content.match(/import.*from\s*(?:'|")(.*)(?:'|");/);
  if (!result) {
    return;
  }
  const corePath = result[1];
  const newPath = config.sys.path.join(
    config.sys.path.dirname(expectedSrc),
    corePath
  );
  content = content.replace(corePath, newPath);

  // insert inline script
  const inlinedScript = doc.createElement('script');
  inlinedScript.setAttribute('type', 'module');
  inlinedScript.innerHTML = content;
  doc.body.appendChild(inlinedScript);

  // remove original script
  script.remove();
}
