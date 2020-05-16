import * as d from '../declarations';
import * as util from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import * as http from 'http';

export async function serveCompilerRequest(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const msgResults = await util.sendMsgWithResponse(process, {
      compilerRequestPath: req.url,
    });

    const results = msgResults.compilerRequestResults;

    if (results) {
      const headers = {
        'content-type': 'application/javascript; charset=utf-8',
        'content-length': Buffer.byteLength(results.content, 'utf8'),
        'x-dev-node-module-id': results.nodeModuleId,
        'x-dev-node-module-version': results.nodeModuleVersion,
        'x-dev-node-module-resolved-path': results.nodeResolvedPath,
        'x-dev-node-module-cache-path': results.cachePath,
        'x-dev-node-module-cache-hit': results.cacheHit,
      };

      res.writeHead(results.status, util.responseHeaders(headers));
      res.write(results.content);
      res.end();
      return;
    }

    return serve404(devServerConfig, req, res, 'serveCompilerRequest');
  } catch (e) {
    return serve500(devServerConfig, req, res, e, 'serveCompilerRequest');
  }
}
