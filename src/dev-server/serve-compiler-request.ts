import type * as d from '../declarations';
import type { ServerResponse } from 'http';
import { responseHeaders, sendLogRequest } from './dev-server-utils';
import { serve500 } from './serve-500';

const compilerRequests = new Map<string, { req: d.HttpRequest; res: ServerResponse; tmr: any }>();

export function serveCompilerRequest(
  devServerConfig: d.DevServerConfig,
  req: d.HttpRequest,
  res: ServerResponse,
  sendMsg: d.DevServerSendMessage,
) {
  const tmr = setTimeout(() => {
    serve500(devServerConfig, req, res, 'Timeout exceeded for dev module', 'serveCompilerRequest', sendMsg);
  }, 15000);

  compilerRequests.set(req.pathname, {
    req,
    res,
    tmr,
  });
  sendMsg({
    compilerRequestPath: req.pathname,
  });
}

export function serveCompilerResponse(
  devServerConfig: d.DevServerConfig,
  compilerRequestResponse: d.CompilerRequestResponse,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    const data = compilerRequests.get(compilerRequestResponse.path);
    if (data) {
      compilerRequests.delete(compilerRequestResponse.path);
      clearTimeout(data.tmr);

      const headers = {
        'content-type': 'application/javascript; charset=utf-8',
        'content-length': Buffer.byteLength(compilerRequestResponse.content, 'utf8'),
        'x-dev-node-module-id': compilerRequestResponse.nodeModuleId,
        'x-dev-node-module-version': compilerRequestResponse.nodeModuleVersion,
        'x-dev-node-module-resolved-path': compilerRequestResponse.nodeResolvedPath,
        'x-dev-node-module-cache-path': compilerRequestResponse.cachePath,
        'x-dev-node-module-cache-hit': compilerRequestResponse.cacheHit,
      };

      data.res.writeHead(compilerRequestResponse.status, responseHeaders(headers));
      data.res.write(compilerRequestResponse.content);
      data.res.end();

      sendLogRequest(devServerConfig, data.req, compilerRequestResponse.status, sendMsg);
    }
  } catch (e) {
    sendMsg({ error: { message: 'serveCompilerResponse: ' + e } });
  }
}
