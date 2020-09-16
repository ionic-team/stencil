import type * as d from '../declarations';
import type { Server } from 'http';
import { createHttpServer, findClosestOpenPort } from './server-http';
import { createNodeSys } from '@sys-api-node';
import { createWebSocket, DevWebSocket } from './server-web-socket';
import { DEV_SERVER_INIT_URL } from './dev-server-constants';
import { getBrowserUrl, responseHeaders } from './dev-server-utils';
import { normalizePath } from '@utils';
import { openInBrowser } from './open-in-browser';
import fs from 'graceful-fs';
import path from 'path';
import util from 'util';

export function initServerProcess(sendMsg: d.DevServerSendMessage) {
  let devServerConfig: d.DevServerConfig = null;
  let server: Server = null;
  let webSocket: DevWebSocket = null;

  const buildResultsResolves: { resolve: (results: d.CompilerBuildResults) => void; reject: (msg: any) => void }[] = [];

  const compilerRequestResolves: {
    path: string;
    resolve: (results: d.CompilerRequestResponse) => void;
    reject: (msg: any) => void;
  }[] = [];

  const logRequest = (req: d.HttpRequest, status: number) => {
    if (devServerConfig) {
      sendMsg({
        requestLog: {
          method: req.method || '?',
          url: req.pathname || '?',
          status,
        },
      });
    }
  };

  const serve500 = (req: d.HttpRequest, res: any, error: any, xSource: string) => {
    try {
      res.writeHead(
        500,
        responseHeaders({
          'content-type': 'text/plain; charset=utf-8',
          'x-source': xSource,
        }),
      );
      res.write(util.inspect(error));
      res.end();
      logRequest(req, 500);
    } catch (e) {
      sendMsg({ error: { message: 'serve500: ' + e } });
    }
  };

  const serve404 = (req: d.HttpRequest, res: any, xSource: string, content: string = null) => {
    try {
      if (req.pathname === '/favicon.ico') {
        const defaultFavicon = path.join(devServerConfig.devServerDir, 'static', 'favicon.ico');
        res.writeHead(
          200,
          responseHeaders({
            'content-type': 'image/x-icon',
            'x-source': `favicon: ${xSource}`,
          }),
        );
        const rs = fs.createReadStream(defaultFavicon);
        rs.on('error', err => {
          res.writeHead(
            404,
            responseHeaders({
              'content-type': 'text/plain; charset=utf-8',
              'x-source': `createReadStream error: ${err}, ${xSource}`,
            }),
          );
          res.write(util.inspect(err));
          res.end();
        });
        rs.pipe(res);
        return;
      }

      if (content == null) {
        content = ['404 File Not Found', 'Url: ' + req.pathname, 'File: ' + req.filePath].join('\n');
      }
      res.writeHead(
        404,
        responseHeaders({
          'content-type': 'text/plain; charset=utf-8',
          'x-source': xSource,
        }),
      );
      res.write(content);
      res.end();

      logRequest(req, 400);
    } catch (e) {
      serve500(req, res, e, xSource);
    }
  };

  const serve302 = (req: d.HttpRequest, res: any, pathname: string = null) => {
    logRequest(req, 302);
    res.writeHead(302, { location: pathname || devServerConfig.basePath || '/' });
    res.end();
  };

  const getBuildResults = () =>
    new Promise<d.CompilerBuildResults>((resolve, reject) => {
      if (server) {
        buildResultsResolves.push({ resolve, reject });
        sendMsg({ requestBuildResults: true });
      } else {
        reject('dev server closed');
      }
    });

  const getCompilerRequest = (compilerRequestPath: string) =>
    new Promise<d.CompilerRequestResponse>((resolve, reject) => {
      if (server) {
        compilerRequestResolves.push({
          path: compilerRequestPath,
          resolve,
          reject,
        });
        sendMsg({ compilerRequestPath });
      } else {
        reject('dev server closed');
      }
    });

  const serverCtx: d.DevServerContext = {
    connectorHtml: null,
    dirTemplate: null,
    getBuildResults,
    getCompilerRequest,
    logRequest,
    prerenderConfig: null,
    serve302,
    serve404,
    serve500,
    sys: createNodeSys({ process }),
  };

  const startServer = async (msg: d.DevServerMessage) => {
    devServerConfig = msg.startServer;
    devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);
    devServerConfig.browserUrl = getBrowserUrl(
      devServerConfig.protocol,
      devServerConfig.address,
      devServerConfig.port,
      devServerConfig.basePath,
      '/',
    );
    devServerConfig.root = normalizePath(devServerConfig.root);

    server = createHttpServer(devServerConfig, serverCtx);

    webSocket = devServerConfig.websocket ? createWebSocket(server, sendMsg) : null;

    server.listen(devServerConfig.port, devServerConfig.address);

    if (devServerConfig.openBrowser) {
      const initialLoadUrl = getBrowserUrl(
        devServerConfig.protocol,
        devServerConfig.address,
        devServerConfig.port,
        devServerConfig.basePath,
        devServerConfig.initialLoadUrl || DEV_SERVER_INIT_URL,
      );
      openInBrowser({ url: initialLoadUrl });
    }

    sendMsg({ serverStarted: devServerConfig });
  };

  const closeServer = () => {
    const promises: Promise<any>[] = [];
    devServerConfig = null;

    buildResultsResolves.forEach(r => r.reject('dev server closed'));
    buildResultsResolves.length = 0;

    compilerRequestResolves.forEach(r => r.reject('dev server closed'));
    compilerRequestResolves.length = 0;

    if (serverCtx.sys) {
      promises.push(serverCtx.sys.destroy());
      serverCtx.sys = null;
    }
    if (webSocket) {
      promises.push(webSocket.close());
      webSocket = null;
    }
    if (server) {
      promises.push(
        new Promise(resolve => {
          server.close(resolve);
        }),
      );
      server = null;
    }
    Promise.all(promises).finally(() => {
      sendMsg({
        serverClosed: true,
      });
    });
  };

  const receiveMessageFromMain = (msg: d.DevServerMessage) => {
    // the server process received a message from main thread
    try {
      if (msg.startServer) {
        startServer(msg);
      } else if (msg.closeServer) {
        closeServer();
      } else if (msg.compilerRequestResults) {
        for (let i = compilerRequestResolves.length - 1; i >= 0; i--) {
          const r = compilerRequestResolves[i];
          if (r.path === msg.compilerRequestResults.path) {
            r.resolve(msg.compilerRequestResults);
            compilerRequestResolves.splice(i, 1);
          }
        }
      } else if (devServerConfig) {
        if (msg.buildResults && !msg.isActivelyBuilding) {
          buildResultsResolves.forEach(r => r.resolve(msg.buildResults));
          buildResultsResolves.length = 0;
        }
        if (webSocket) {
          webSocket.sendToBrowser(msg);
        }
      }
    } catch (e) {
      sendMsg({
        error: { message: e + '', stack: e?.stack ? e.stack : null },
      });
    }
  };

  return receiveMessageFromMain;
}
