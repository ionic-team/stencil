import * as d from '../../declarations';

export function optimizeCriticalPath(doc: Document, config: d.Config, criticalPath: string[], outputTarget: d.OutputTargetWww) {
  const relativeBuildDir = config.sys.path.relative(outputTarget.dir, outputTarget.buildDir);
  const paths = criticalPath.map(path => '/' + config.sys.path.join(relativeBuildDir, path));
  injectModulePreloads(doc, paths);
}

export function injectModulePreloads(doc: Document, paths: string[]) {
  const links = paths.map(path => createModulePreload(doc, path));
  const firstScript = doc.head.querySelector('script');
  if (firstScript) {
    links.forEach(link => {
      doc.head.insertBefore(link, firstScript);
    });
  } else {
    links.forEach(link => {
      doc.head.appendChild(link);
    });
  }
}

function createModulePreload(doc: Document, href: string) {
  const link = doc.createElement('link');
  link.setAttribute('rel', 'modulepreload');
  link.setAttribute('href', href);
  return link;
}
