import * as d from '../declarations';
import * as util from './util';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import { serveFile } from './serve-file';
import { serveOpenInEditor } from './open-in-editor';
import * as http  from 'http';
import * as path from 'path';

let cachedDevServerClientScript: string;


export async function serveDevClient(devServerConfig: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    if (util.isOpenInEditor(req.pathname)) {
      return serveOpenInEditor(devServerConfig, fs, req, res);
    }

    if (util.isDevServerClient(req.pathname)) {
      return serveDevClientScript(devServerConfig, fs, res);
    }

    if (util.isInitialDevServerLoad(req.pathname)) {
      req.filePath = path.join(devServerConfig.devServerDir, 'templates', 'initial-load.html');

    } else {
      const staticFile = req.pathname.replace(util.DEV_SERVER_URL + '/', '');
      req.filePath = path.join(devServerConfig.devServerDir, 'static', staticFile);
    }

    try {
      req.stats = await fs.stat(req.filePath);
      return serveFile(devServerConfig, fs, req, res);
    } catch (e) {
      return serve404(devServerConfig, fs, req, res);
    }

  } catch (e) {
    return serve500(res, e);
  }
}


async function serveDevClientScript(devServerConfig: d.DevServerConfig, fs: d.FileSystem, res: http.ServerResponse) {
  const filePath = path.join(devServerConfig.devServerDir, 'static', 'dev-server-client.html');

  let content = await fs.readFile(filePath);

  const devClientConfig: d.DevClientConfig = {
    editors: devServerConfig.editors,
    hmr: devServerConfig.hotReplacement
  };

  content = content.replace('__DEV_CLIENT_CONFIG__', JSON.stringify(devClientConfig));

  res.writeHead(200, util.responseHeaders({
    'Content-Type': 'text/html'
  }));
  res.write(content);
  res.end();
}


export async function getDevServerClientScript(devServerConfig: d.DevServerConfig, fs: d.FileSystem) {
  if (!cachedDevServerClientScript) {
    const dirTemplatePath = path.join(devServerConfig.devServerDir, 'templates', 'dev-client-iframe.html');
    const dirTemplate = await fs.readFile(dirTemplatePath);

    cachedDevServerClientScript = dirTemplate
      .replace('{{DEV_SERVER_URL}}', util.DEV_SERVER_URL);
  }

  return cachedDevServerClientScript;
}
