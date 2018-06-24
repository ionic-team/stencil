import * as d from '../declarations';
import * as http  from 'http';
import * as path  from 'path';
import { sendError } from './util';


export async function serve404(config: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Expires': '0',
      'Content-Type': 'text/html',
      'X-Powered-By': 'Stencil Dev Server'
    };

    let content: string;

    const pathName = req.pathname.toLowerCase();

    if (pathName.endsWith('.js') || pathName.endsWith('.css')) {
      headers['Content-Type'] = 'text/plain';
      content = [
        '404 File Not Found',
        'Url: ' + req.pathname,
        'File: ' + req.filePath
      ].join('\n');

    } else  {
      const tmpl404 = await fs.readFile(path.join(config.devServerDir, 'templates', '404.html'));
      content = tmpl404.replace(
        '{{content}}',
        `File not found: ${req.pathname}`
      );
    }

    res.writeHead(404, headers);
    res.write(content);
    res.end();

  } catch (e) {
    serve500(res, e);
  }
}


export function serve500(res: http.ServerResponse, error: any) {
  try {
    res.writeHead(500, {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Expires': '0',
      'Content-Type': 'text/plain',
      'X-Powered-By': 'Stencil Dev Server'
    });

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

  } catch (e) {
    sendError(process, 'serve500: ' + e);
  }
}
