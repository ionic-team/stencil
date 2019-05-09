import * as d from '../../declarations';
import { getAbsoluteBuildDir } from './utils';

export function updateGlobalStylesLink(config: d.Config, doc: Document, globalScriptFilename: string, outputTarget: d.OutputTargetWww) {
  if (!globalScriptFilename) {
    return;
  }
  const buildDir = getAbsoluteBuildDir(config, outputTarget);
  const originalPath = config.sys.path.join(
    buildDir,
    config.fsNamespace + '.css'
  );
  const newPath = config.sys.path.join(
    buildDir,
    globalScriptFilename
  );
  if (originalPath === newPath) {
    return;
  }

  const replacer = new RegExp(
    escapeRegExp(originalPath) + '$'
  );

  Array.from(doc.querySelectorAll('link')).forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const newHref = href.replace(replacer, newPath);
      if (newHref !== href) {
        link.setAttribute('href', newHref);
      }
    }
  });
}

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
