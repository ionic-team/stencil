import * as d from '@declarations';
import { isDevClient } from './dev-server-utils';
import { normalizePath } from '@utils';
import { serveDevClient } from './serve-dev-client';
import { serveFile } from './serve-file';
import { serve404, serve404Content } from './serve-404';
import { serve500 } from './serve-500';
import { serveDirectoryIndex } from './serve-directory-index';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';


export function createRequestHandler(devServerConfig: d.DevServerConfig, fs: d.FileSystem) {

  return async function(incomingReq: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const req = normalizeHttpRequest(devServerConfig, incomingReq);

      if (req.url === '') {
        res.writeHead(302, { 'location': '/' });
        return res.end();
      }

      if (!req.url.startsWith(devServerConfig.baseUrl)) {
        return serve404Content(res, `404 File Not Found, base url: ${devServerConfig.baseUrl}`);
      }

      if (isDevClient(req.pathname)) {
        return serveDevClient(devServerConfig, fs, req, res);
      }

      try {
        req.stats = await fs.stat(req.filePath);

        if (req.stats.isFile()) {
          return serveFile(devServerConfig, fs, req, res);
        }

        if (req.stats.isDirectory()) {
          return serveDirectoryIndex(devServerConfig, fs, req, res);
        }

      } catch (e) {}

      if (isValidHistoryApi(devServerConfig, req)) {
        try {
          const indexFilePath = path.join(devServerConfig.root, devServerConfig.historyApiFallback.index);

          req.stats = await fs.stat(indexFilePath);
          if (req.stats.isFile()) {
            req.filePath = indexFilePath;
            return serveFile(devServerConfig, fs, req, res);
          }

        } catch (e) {}
      }

      return serve404(devServerConfig, fs, req, res);

    } catch (e) {
      return serve500(res, e);
    }
  };
}


function normalizeHttpRequest(devServerConfig: d.DevServerConfig, incomingReq: http.IncomingMessage) {
  const req: d.HttpRequest = {
    method: (incomingReq.method || 'GET').toUpperCase() as any,
    headers: incomingReq.headers as any,
    acceptHeader: (incomingReq.headers && typeof incomingReq.headers.accept === 'string' && incomingReq.headers.accept) || '',
    url: (incomingReq.url || '').trim() || '',
    host: (incomingReq.headers && typeof incomingReq.headers.host === 'string' && incomingReq.headers.host) || null
  };

  const parsedUrl = url.parse(req.url);
  const parts = (parsedUrl.pathname || '').replace(/\\/g, '/').split('/');

  req.pathname = parts.map(part => decodeURIComponent(part)).join('/');
  if (req.pathname.length > 0) {
    req.pathname = '/' + req.pathname.substring(devServerConfig.baseUrl.length);
  }

  req.filePath = normalizePath(path.normalize(
    path.join(devServerConfig.root,
      path.relative('/', req.pathname)
    )
  ));

  return req;
}


export function isValidHistoryApi(devServerConfig: d.DevServerConfig, req: d.HttpRequest) {
  if (!devServerConfig.historyApiFallback) {
    return false;
  }
  if (req.method !== 'GET') {
    return false;
  }
  if (!req.acceptHeader.includes('text/html')) {
    return false;
  }
  if (!devServerConfig.historyApiFallback.disableDotRule && req.pathname.includes('.')) {
    return false;
  }
  return true;
}
