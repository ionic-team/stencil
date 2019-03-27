import * as d from '../declarations';
import * as http  from 'http';
import { responseHeaders, sendError, sendMsg } from './dev-server-utils';


export function serve500(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, error: any) {
  try {
    res.writeHead(500, responseHeaders({
      'Content-Type': 'text/plain'
    }));

    let errorMsg = '';

    if (typeof error === 'string') {
      errorMsg = error;

    } else if (error) {
      if (error.message) {
        errorMsg += error.message + '\n';
      }
      if (error.stack) {
        errorMsg += error.stack + '\n';
      }
    }

    res.write(errorMsg);
    res.end();

    if (devServerConfig.logRequests) {
      sendMsg(process, {
        requestLog: {
          method: req.method,
          url: req.url,
          status: 200
        }
      });
    }

  } catch (e) {
    sendError(process, 'serve500: ' + e);
  }
}
