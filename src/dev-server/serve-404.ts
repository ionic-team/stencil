import * as d from '../declarations';
import * as http from 'http';
import fs from 'graceful-fs';
import path from 'path';
import util from 'util';
import { responseHeaders, sendMsg } from './dev-server-utils';
import { serve500 } from './serve-500';

export async function serve404(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, xSource: string) {
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
        serve500(devServerConfig, req, res, e, xSource);
      }
    }

    const content = ['404 File Not Found', 'Url: ' + req.pathname, 'File: ' + req.filePath].join('\n');

    serve404Content(devServerConfig, req, res, content, xSource);

    if (devServerConfig.logRequests) {
      sendMsg(process, {
        requestLog: {
          method: req.method,
          url: req.url,
          status: 404,
        },
      });
    }
  } catch (e) {
    serve500(devServerConfig, req, res, e, xSource);
  }
}

export function serve404Content(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, content: string, xSource: string) {
  try {
    const headers = responseHeaders({
      'content-type': 'text/plain; charset=utf-8',
      'x-source': xSource,
    });

    res.writeHead(404, headers);
    res.write(content);
    res.end();
  } catch (e) {
    serve500(devServerConfig, req, res, e, 'serve404Content: ' + xSource);
  }
}
