import * as d from '@declarations';
import { PRERENDER_HOST } from './prerender-queue';


export function getWriteFilePathFromUrlPath(manager: d.PrerenderManager, inputUrl: string) {
  const url = new URL(inputUrl, PRERENDER_HOST);

  let pathName = url.pathname;
  if (pathName.startsWith(manager.outputTarget.baseUrl)) {
    pathName = pathName.substring(manager.outputTarget.baseUrl.length);

  } else if (manager.outputTarget.baseUrl === pathName + '/') {
    pathName = '/';
  }

  // figure out the directory where this file will be saved
  const dir = manager.config.sys.path.join(
    manager.outputTarget.dir,
    pathName
  );

  // create the full path where this will be saved (normalize for windowz)
  let filePath: string;

  if (dir + '/' === manager.outputTarget.dir + '/') {
    // this is the root of the output target directory
    // use the configured index.html
    const basename = manager.outputTarget.indexHtml.substr(dir.length + 1);
    filePath = manager.config.sys.path.join(dir, basename);

  } else {
    filePath = manager.config.sys.path.join(dir, `index.html`);
  }

  return filePath;
}
