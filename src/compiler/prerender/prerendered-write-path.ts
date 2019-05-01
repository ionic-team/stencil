import * as d from '../../declarations';
import { URL } from 'url';


export function getWriteFilePathFromUrlPath(manager: d.PrerenderManager, inputUrl: string) {
  const url = new URL(inputUrl, manager.devServerHostUrl);


  let prerenderPathname = url.pathname;
  if (prerenderPathname.startsWith(manager.basePath)) {
    prerenderPathname = prerenderPathname.substring(manager.basePath.length);

  } else if (manager.outputTarget.baseUrl === prerenderPathname + '/') {
    prerenderPathname = '/';
  }

  // figure out the directory where this file will be saved
  const dir = manager.config.sys.path.join(
    manager.outputTarget.dir,
    prerenderPathname
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
