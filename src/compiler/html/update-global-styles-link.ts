import type * as d from '../../declarations';
import { getAbsoluteBuildDir } from './html-utils';
import { join } from 'path';

export const updateGlobalStylesLink = (
  config: d.Config,
  doc: Document,
  globalScriptFilename: string,
  outputTarget: d.OutputTargetWww
) => {
  if (!globalScriptFilename) {
    return;
  }
  const buildDir = getAbsoluteBuildDir(outputTarget);
  const originalPath = join(buildDir, config.fsNamespace + '.css');
  const newPath = join(buildDir, globalScriptFilename);
  if (originalPath === newPath) {
    return;
  }

  const replacer = new RegExp(escapeRegExp(originalPath) + '$');

  Array.from(doc.querySelectorAll('link')).forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const newHref = href.replace(replacer, newPath);
      if (newHref !== href) {
        link.setAttribute('href', newHref);
      }
    }
  });
};

const escapeRegExp = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
