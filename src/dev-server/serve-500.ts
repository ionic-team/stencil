import type * as d from '../declarations';
import type { ServerResponse } from 'http';
import { responseHeaders, sendLogRequest } from './dev-server-utils';
import util from 'util';

export function serve500(
  devServerConfig: d.DevServerConfig,
  req: d.HttpRequest,
  res: ServerResponse,
  error: any,
  xSource: string,
  sendMsg: d.DevServerSendMessage,
) {
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

    sendLogRequest(devServerConfig, req, 500, sendMsg);
  } catch (e) {
    sendMsg({ error: { message: 'serve500: ' + e } });
  }
}
