import * as d from '@declarations';
import * as http  from 'http';
import * as path  from 'path';
import { responseHeaders } from './util';
import { serve500 } from './serve-500';


export async function serve404(devServerConfig: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    if (req.pathname === '/favicon.ico') {
      try {
        const defaultFavicon = path.join(devServerConfig.devServerDir, 'static', 'favicon.ico');
        res.writeHead(200, responseHeaders({
          'Content-Type': 'image/x-icon'
        }));
        fs.createReadStream(defaultFavicon).pipe(res);
        return;
      } catch (e) {}
    }

    const content = [
      '404 File Not Found',
      'Url: ' + req.pathname,
      'File: ' + req.filePath
    ].join('\n');

    serve404Content(res, content);

  } catch (e) {
    serve500(res, e);
  }
}


export function serve404Content(res: http.ServerResponse, content: string) {
  try {
    const headers = responseHeaders({
      'Content-Type': 'text/plain'
    });

    res.writeHead(404, headers);
    res.write(content);
    res.end();

  } catch (e) {
    serve500(res, e);
  }
}
