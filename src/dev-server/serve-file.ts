import * as d from '../declarations';
import { DEV_SERVER_URL, getContentType, isCssFile, isDevServerClient, isHtmlFile, isInitialDevServerLoad, isSimpleText, shouldCompress } from './util';
import { serve404, serve500 } from './serve-error';
import * as http  from 'http';
import * as path from 'path';
import * as querystring from 'querystring';
import * as Url from 'url';
import * as zlib from 'zlib';
import { Buffer } from 'buffer';


export async function serveFile(devServerConfig: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    if (isSimpleText(req.filePath)) {
      // easy text file, use the internal cache
      let content = await fs.readFile(req.filePath);

      if (isHtmlFile(req.filePath) && !isDevServerClient(req.pathname)) {
        // auto inject our dev server script
        content += injectDevServerClient();

      } else if (isCssFile(req.filePath)) {
        content = updateStyleUrls(req.url, content);
      }

      const contentLength = Buffer.byteLength(content, 'utf8');

      if (shouldCompress(devServerConfig, req, contentLength)) {
        // let's gzip this well known web dev text file
        res.writeHead(200, {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Expires': '0',
          'Content-Type': getContentType(devServerConfig, req.filePath),
          'X-Powered-By': 'Stencil Dev Server'
        });
        zlib.createGzip().pipe(res);

      } else {
        // let's not gzip this file
        res.writeHead(200, {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Expires': '0',
          'Content-Type': getContentType(devServerConfig, req.filePath),
          'Content-Length': contentLength,
          'X-Powered-By': 'Stencil Dev Server'
        });
        res.write(content);
        res.end();
      }

    } else {
      // non-well-known text file or other file, probably best we use a stream
      // but don't bother trying to gzip this file for the dev server
      res.writeHead(200, {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Expires': '0',
        'Content-Type': getContentType(devServerConfig, req.filePath),
        'Content-Length': req.stats.size,
        'X-Powered-By': 'Stencil Dev Server'
      });
      fs.createReadStream(req.filePath).pipe(res);
    }

  } catch (e) {
    serve500(res, e);
  }
}


export async function serveStaticDevClient(devServerConfig: d.DevServerConfig, fs: d.FileSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    if (isDevServerClient(req.pathname)) {
      req.filePath = path.join(devServerConfig.devServerDir, 'static', 'dev-server-client.html');

    } else if (isInitialDevServerLoad(req.pathname)) {
      req.filePath = path.join(devServerConfig.devServerDir, 'templates', 'initial-load.html');

    } else {
      const staticFile = req.pathname.replace(DEV_SERVER_URL + '/', '');
      req.filePath = path.join(devServerConfig.devServerDir, 'static', staticFile);
    }

    try {
      req.stats = await fs.stat(req.filePath);
      return serveFile(devServerConfig, fs, req, res);
    } catch (e) {
      return serve404(req, res);
    }

  } catch (e) {
    return serve500(res, e);
  }
}


function injectDevServerClient() {
  return `\n<iframe src="${DEV_SERVER_URL}" style="width:0;height:0;border:0"></iframe>`;
}


function updateStyleUrls(cssUrl: string, oldCss: string) {
  const parsedUrl = Url.parse(cssUrl);
  const qs = querystring.parse(parsedUrl.query);

  const versionId = qs['s-hmr'];
  const hmrUrls = qs['s-hmr-urls'];

  if (versionId && hmrUrls) {
    (hmrUrls as string).split(',').forEach(hmrUrl => {
      urlVersionIds.set(hmrUrl, versionId as string);
    });
  }

  const reg = /url\((['"]?)(.*)\1\)/ig;
  let result;
  let newCss = oldCss;

  while ((result = reg.exec(oldCss)) !== null) {
    const oldUrl = result[2];

    const parsedUrl = Url.parse(oldUrl);

    const fileName = path.basename(parsedUrl.pathname);
    const versionId = urlVersionIds.get(fileName);
    if (!versionId) {
      continue;
    }

    const qs = querystring.parse(parsedUrl.query);
    qs['s-hmr'] = versionId;

    parsedUrl.search = querystring.stringify(qs);

    const newUrl = Url.format(parsedUrl);

    newCss = newCss.replace(oldUrl, newUrl);
  }

  return newCss;
}

const urlVersionIds = new Map<string, string>();
