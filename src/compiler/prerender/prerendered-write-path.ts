import * as d from '@declarations';
import { PRERENDER_HOST } from './prerender-queue';
import { sys } from '@sys';
import { URL } from 'url';


export function getWriteFilePathFromUrlPath(outputTarget: d.OutputTargetWww, url: string) {
  const parsedUrl = new URL(url, PRERENDER_HOST);

  let pathName = parsedUrl.pathname;
  if (pathName.startsWith(outputTarget.baseUrl)) {
    pathName = pathName.substring(outputTarget.baseUrl.length);

  } else if (outputTarget.baseUrl === pathName + '/') {
    pathName = '/';
  }

  // figure out the directory where this file will be saved
  const dir = sys.path.join(
    outputTarget.dir,
    pathName
  );

  // create the full path where this will be saved (normalize for windowz)
  let filePath: string;

  if (dir + '/' === outputTarget.dir + '/') {
    // this is the root of the output target directory
    // use the configured index.html
    const basename = outputTarget.indexHtml.substr(dir.length + 1);
    filePath = sys.path.join(dir, basename);

  } else {
    filePath = sys.path.join(dir, `index.html`);
  }

  return filePath;
}
