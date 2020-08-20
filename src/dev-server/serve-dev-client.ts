import type * as d from '../declarations';
import type { ServerResponse } from 'http';
import { DEV_SERVER_URL } from './dev-server-constants';
import { isDevServerClient, isInitialDevServerLoad, isOpenInEditor, responseHeaders } from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import { serveFile } from './serve-file';
import { serveOpenInEditor, getEditors } from './open-in-editor';
import path from 'path';

export async function serveDevClient(
  devServerConfig: d.DevServerConfig,
  sys: d.CompilerSystem,
  req: d.HttpRequest,
  res: ServerResponse,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    if (isOpenInEditor(req.pathname)) {
      return serveOpenInEditor(devServerConfig, sys, req, res, sendMsg);
    }

    if (isDevServerClient(req.pathname)) {
      return serveDevClientScript(devServerConfig, sys, req, res, sendMsg);
    }

    if (isInitialDevServerLoad(req.pathname)) {
      req.filePath = path.join(devServerConfig.devServerDir, 'templates', 'initial-load.html');
    } else {
      const staticFile = req.pathname.replace(DEV_SERVER_URL + '/', '');
      req.filePath = path.join(devServerConfig.devServerDir, 'static', staticFile);
    }

    try {
      req.stats = await sys.stat(req.filePath);
      if (req.stats.isFile) {
        return serveFile(devServerConfig, sys, req, res, sendMsg);
      }
      return serve404(devServerConfig, req, res, 'serveDevClient not file', sendMsg);
    } catch (e) {
      return serve404(devServerConfig, req, res, `serveDevClient stats error ${e}`, sendMsg);
    }
  } catch (e) {
    return serve500(devServerConfig, req, res, e, 'serveDevClient', sendMsg);
  }
}

let connectorHtml: string = null;

async function serveDevClientScript(
  devServerConfig: d.DevServerConfig,
  sys: d.CompilerSystem,
  req: d.HttpRequest,
  res: ServerResponse,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    if (connectorHtml == null) {
      const filePath = path.join(devServerConfig.devServerDir, 'connector.html');

      connectorHtml = await sys.readFile(filePath, 'utf8');
      if (typeof connectorHtml === 'string') {
        const devClientConfig: d.DevClientConfig = {
          basePath: devServerConfig.basePath,
          editors: await getEditors(),
          reloadStrategy: devServerConfig.reloadStrategy,
        };

        connectorHtml = connectorHtml.replace('window.__DEV_CLIENT_CONFIG__', JSON.stringify(devClientConfig));
      } else {
        serve404(devServerConfig, req, res, 'serveDevClientScript', sendMsg);
        return;
      }
    }

    res.writeHead(
      200,
      responseHeaders({
        'content-type': 'text/html; charset=utf-8',
      }),
    );
    res.write(connectorHtml);
    res.end();
  } catch (e) {
    serve500(devServerConfig, req, res, e, 'serveDevClientScript', sendMsg);
  }
}
