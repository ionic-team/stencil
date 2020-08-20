import type * as d from '../declarations';
import type { ServerResponse } from 'http';
import fs from 'graceful-fs';
import path from 'path';
import util from 'util';
import { responseHeaders, sendLogRequest } from './dev-server-utils';
import { serve500 } from './serve-500';

export function serve404(
  devServerConfig: d.DevServerConfig,
  req: d.HttpRequest,
  res: ServerResponse,
  xSource: string,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    if (req.pathname === '/favicon.ico') {
      try {
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
      } catch (e) {
        serve500(devServerConfig, req, res, e, xSource, sendMsg);
      }
    }

    const content = ['404 File Not Found', 'Url: ' + req.pathname, 'File: ' + req.filePath].join('\n');

    serve404Content(devServerConfig, req, res, content, xSource, sendMsg);
    sendLogRequest(devServerConfig, req, 400, sendMsg);
  } catch (e) {
    serve500(devServerConfig, req, res, e, xSource, sendMsg);
  }
}

export function serve404Content(
  devServerConfig: d.DevServerConfig,
  req: d.HttpRequest,
  res: ServerResponse,
  content: string,
  xSource: string,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    const headers = responseHeaders({
      'content-type': 'text/plain; charset=utf-8',
      'x-source': xSource,
    });

    res.writeHead(404, headers);
    res.write(content);
    res.end();
  } catch (e) {
    serve500(devServerConfig, req, res, e, 'serve404Content: ' + xSource, sendMsg);
  }
}
