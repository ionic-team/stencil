import * as d from '../../declarations';
import { getAbsoluteBuildDir } from './utils';
import { generateHashedCopy } from '../copy/hashed-copy';


export async function optimizeEsmImport(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, outputTarget: d.OutputTargetWww) {
  const resourcesUrl = getAbsoluteBuildDir(config, outputTarget);
  const entryFilename = `${config.fsNamespace}.esm.js`;
  const expectedSrc = config.sys.path.join(resourcesUrl, entryFilename);

  const script = Array.from(doc.querySelectorAll('script'))
    .find(s => s.getAttribute('type') === 'module' && s.getAttribute('src') === expectedSrc);

  if (!script) {
    return false;
  }

  const entryPath = config.sys.path.join(outputTarget.buildDir, entryFilename);
  let content = await compilerCtx.fs.readFile(entryPath);

  // If the script is too big, instead of inlining, we hash the file and change
  // the <script> to the new location
  if (content.length > MAX_JS_INLINE_SIZE) {
    const hashedFile = await generateHashedCopy(config, compilerCtx, entryPath);
    if (hashedFile) {
      script.setAttribute('src', config.sys.path.join(resourcesUrl, hashedFile));
      script.setAttribute('data-resources-url', resourcesUrl);
      script.setAttribute('data-namespace', config.fsNamespace);
      return true;
    }
    return false;
  }

  // Let's try to inline, we have to fix all the relative paths of the imports
  const result = content.match(/import.*from\s*(?:'|")(.*)(?:'|");/);
  if (!result) {
    return false;
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
  inlinedScript.setAttribute('data-resources-url', resourcesUrl);
  inlinedScript.setAttribute('data-namespace', config.fsNamespace);
  inlinedScript.innerHTML = content;
  doc.body.appendChild(inlinedScript);

  // remove original script
  script.remove();
  return true;
}

const MAX_JS_INLINE_SIZE = 4 * 1024;
