import * as d from '../declarations';
import * as http from 'http';
import { responseHeaders, sendError, sendMsg } from './dev-server-utils';
import util from 'util';

export function serve500(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, error: any) {
  try {
    res.writeHead(
      500,
      responseHeaders({
        'Content-Type': 'text/plain;charset=UTF-8',
      }),
    );

    res.write(util.inspect(error));
    res.end();

    if (devServerConfig.logRequests) {
      sendMsg(process, {
        requestLog: {
          method: req.method,
          url: req.url,
          status: 500,
        },
      });
    }
  } catch (e) {
    sendError(process, 'serve500: ' + e);
  }
}
