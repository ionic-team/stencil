import * as d from '../../declarations';


export function getWriteFilePathFromUrlPath(manager: d.PrerenderManager, inputUrl: string) {
  const url = new URL(inputUrl, manager.origin);

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


export async function writeOrgIndexHtml(manager: d.PrerenderManager, templateHtml: string) {
  const fileName = `index-org.html`;
  const filePath = manager.config.sys.path.join(
    manager.outputTarget.dir,
    fileName
  );

  await manager.compilerCtx.fs.writeFile(filePath, templateHtml, { immediateWrite: true });
}
