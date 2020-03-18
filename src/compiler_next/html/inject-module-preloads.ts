import * as d from '../../declarations';
import { getAbsoluteBuildDir } from './html-utils';
import { join } from 'path';

export const optimizeCriticalPath = (doc: Document, criticalBundlers: string[], outputTarget: d.OutputTargetWww) => {
  const buildDir = getAbsoluteBuildDir(outputTarget);
  const paths = criticalBundlers.map(path => join(buildDir, path));
  injectModulePreloads(doc, paths);
};

export const injectModulePreloads = (doc: Document, paths: string[]) => {
  const existingLinks = (Array.from(doc.querySelectorAll('link[rel=modulepreload]')) as HTMLLinkElement[]).map(link => link.getAttribute('href'));

  const addLinks = paths.filter(path => !existingLinks.includes(path)).map(path => createModulePreload(doc, path));

  const firstScript = doc.head.querySelector('script');
  if (firstScript) {
    addLinks.forEach(link => {
      doc.head.insertBefore(link, firstScript);
    });
  } else {
    addLinks.forEach(link => {
      doc.head.appendChild(link);
    });
  }
};

const createModulePreload = (doc: Document, href: string) => {
  const link = doc.createElement('link');
  link.setAttribute('rel', 'modulepreload');
  link.setAttribute('href', href);
  return link;
};
