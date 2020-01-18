import * as d from '../declarations';
import * as util from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import * as http  from 'http';


export async function serveCompilerRequest(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const msgResults = await util.sendMsgWithResponse(process, {
      compilerRequestPath: req.url
    });

    const results = msgResults.compilerRequestResults;

    if (results) {
      const headers = {
        'Content-Type': 'application/javascript',
        'Content-Length': Buffer.byteLength(results.content, 'utf8'),
        'X-Dev-Node-Module-Id': results.nodeModuleId,
        'X-Dev-Node-Module-Version': results.nodeModuleVersion,
        'X-Dev-Node-Module-Resolved-Path': results.nodeResolvedPath,
        'X-Dev-Node-Module-Cache-Path': results.cachePath,
        'X-Dev-Node-Module-Cache-Hit': results.cacheHit,
      };

      res.writeHead(results.status, util.responseHeaders(headers));
      res.write(results.content);
      res.end();
      return;
    }

    return serve404(devServerConfig, req, res);

  } catch (e) {
    return serve500(devServerConfig, req, res, e);
  }
}
