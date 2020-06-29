import * as d from '../declarations';
import { isDevClient, isDevModule, sendMsg } from './dev-server-utils';
import { normalizePath } from '@utils';
import { serveDevClient } from './serve-dev-client';
import { serveFile } from './serve-file';
import { serve404, serve404Content } from './serve-404';
import { serve500 } from './serve-500';
import { serveCompilerRequest } from './serve-compiler-request';
import { serveDirectoryIndex } from './serve-directory-index';
import * as http from 'http';
import path from 'path';
import * as url from 'url';

export function createRequestHandler(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem) {
  return async function (incomingReq: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const req = normalizeHttpRequest(devServerConfig, incomingReq);

      if (req.url === '') {
        res.writeHead(302, { location: '/' });

        if (devServerConfig.logRequests) {
          sendMsg(process, {
            requestLog: {
              method: req.method,
              url: req.url,
              status: 302,
            },
          });
        }

        return res.end();
      }

      if (isDevClient(req.pathname) && devServerConfig.websocket) {
        return serveDevClient(devServerConfig, sys, req, res);
      }

      if (isDevModule(req.pathname)) {
        return serveCompilerRequest(devServerConfig, req, res);
      }

      if (!isValidUrlBasePath(devServerConfig.basePath, req.url)) {
        if (devServerConfig.logRequests) {
          sendMsg(process, {
            requestLog: {
              method: req.method,
              url: req.url,
              status: 404,
            },
          });
        }

        return serve404Content(devServerConfig, req, res, `404 File Not Found, base path: ${devServerConfig.basePath}`, `invalid basePath`);
      }

      try {
        req.stats = await sys.stat(req.filePath);

        if (req.stats) {
          if (req.stats.isFile()) {
            return serveFile(devServerConfig, sys, req, res);
          }

          if (req.stats.isDirectory()) {
            return serveDirectoryIndex(devServerConfig, sys, req, res);
          }
        }
      } catch (e) {}

      const xSource = ['notfound'];
      const validHistoryApi = isValidHistoryApi(devServerConfig, req);
      xSource.push(`validHistoryApi: ${validHistoryApi}`);

      if (validHistoryApi) {
        try {
          const indexFilePath = path.join(devServerConfig.root, devServerConfig.historyApiFallback.index);
          xSource.push(`indexFilePath: ${indexFilePath}`);

          req.stats = await sys.stat(indexFilePath);
          if (req.stats && req.stats.isFile()) {
            req.filePath = indexFilePath;
            return serveFile(devServerConfig, sys, req, res);
          }
        } catch (e) {
          xSource.push(`notfound error: ${e}`);
        }
      }

      return serve404(devServerConfig, req, res, xSource.join(', '));
    } catch (e) {
      return serve500(devServerConfig, incomingReq as any, res, e, `not found error`);
    }
  };
}

export function isValidUrlBasePath(basePath: string, url: string) {
  // normalize the paths to always end with a slash for the check
  if (!url.endsWith('/')) {
    url += '/';
  }
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }
  return url.startsWith(basePath);
}

function normalizeHttpRequest(devServerConfig: d.DevServerConfig, incomingReq: http.IncomingMessage) {
  const req: d.HttpRequest = {
    method: (incomingReq.method || 'GET').toUpperCase() as any,
    headers: incomingReq.headers as any,
    acceptHeader: (incomingReq.headers && typeof incomingReq.headers.accept === 'string' && incomingReq.headers.accept) || '',
    url: (incomingReq.url || '').trim() || '',
    host: (incomingReq.headers && typeof incomingReq.headers.host === 'string' && incomingReq.headers.host) || null,
  };

  const parsedUrl = url.parse(req.url);
  const parts = (parsedUrl.pathname || '').replace(/\\/g, '/').split('/');

  req.pathname = parts.map(part => decodeURIComponent(part)).join('/');
  if (req.pathname.length > 0 && !isDevClient(req.pathname)) {
    req.pathname = '/' + req.pathname.substring(devServerConfig.basePath.length);
  }

  req.filePath = normalizePath(path.normalize(path.join(devServerConfig.root, path.relative('/', req.pathname))));

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
