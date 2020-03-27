import * as d from '../declarations';
import * as c from './dev-server-constants';
import * as util from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import { serveFile } from './serve-file';
import { serveOpenInEditor } from './open-in-editor';
import * as http from 'http';
import path from 'path';

export async function serveDevClient(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    if (util.isOpenInEditor(req.pathname)) {
      return serveOpenInEditor(devServerConfig, sys, req, res);
    }

    if (util.isDevServerClient(req.pathname)) {
      return serveDevClientScript(devServerConfig, sys, req, res);
    }

    if (util.isInitialDevServerLoad(req.pathname)) {
      req.filePath = path.join(devServerConfig.devServerDir, 'templates', 'initial-load.html');
    } else {
      const staticFile = req.pathname.replace(c.DEV_SERVER_URL + '/', '');
      req.filePath = path.join(devServerConfig.devServerDir, 'static', staticFile);
    }

    try {
      req.stats = await sys.stat(req.filePath);
      if (req.stats) {
        return serveFile(devServerConfig, sys, req, res);
      }
      return serve404(devServerConfig, req, res, 'serveDevClient no stats');
    } catch (e) {
      return serve404(devServerConfig, req, res, `serveDevClient stats error ${e}`);
    }
  } catch (e) {
    return serve500(devServerConfig, req, res, e, 'serveDevClient');
  }
}

async function serveDevClientScript(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const filePath = path.join(devServerConfig.devServerDir, 'connector.html');

    let content = await sys.readFile(filePath, 'utf8');
    if (typeof content === 'string') {
      const devClientConfig: d.DevClientConfig = {
        basePath: devServerConfig.basePath,
        editors: devServerConfig.editors,
        reloadStrategy: devServerConfig.reloadStrategy,
      };

      content = content.replace('window.__DEV_CLIENT_CONFIG__', JSON.stringify(devClientConfig));

      res.writeHead(
        200,
        util.responseHeaders({
          'content-type': 'text/html; charset=utf-8',
        }),
      );
      res.write(content);
      res.end();
    } else {
      serve404(devServerConfig, req, res, 'serveDevClientScript');
    }
  } catch (e) {
    serve500(devServerConfig, req, res, e, 'serveDevClientScript');
  }
}
