import type * as d from '../declarations';
import type { IncomingMessage, ServerResponse } from 'http';
import { isDevClient, isDevModule, sendLogRequest } from './dev-server-utils';
import { normalizePath } from '@utils';
import { serveDevClient } from './serve-dev-client';
import { serveFile } from './serve-file';
import { serve404, serve404Content } from './serve-404';
import { serve500 } from './serve-500';
import { serveCompilerRequest } from './serve-compiler-request';
import { serveDirectoryIndex } from './serve-directory-index';
import path from 'path';

export function createRequestHandler(
  devServerConfig: d.DevServerConfig,
  sys: d.CompilerSystem,
  sendMsg: d.DevServerSendMessage,
) {
  return async function (incomingReq: IncomingMessage, res: ServerResponse) {
    try {
      const req = normalizeHttpRequest(devServerConfig, incomingReq);

      if (!req.url) {
        res.writeHead(302, { location: '/' });
        sendLogRequest(devServerConfig, req, 302, sendMsg);
        return res.end();
      }

      if (isDevClient(req.pathname) && devServerConfig.websocket) {
        return serveDevClient(devServerConfig, sys, req, res, sendMsg);
      }

      if (isDevModule(req.pathname)) {
        return serveCompilerRequest(devServerConfig, req, res, sendMsg);
      }

      if (!isValidUrlBasePath(devServerConfig.basePath, req.url)) {
        sendLogRequest(devServerConfig, req, 404, sendMsg);

        return serve404Content(
          devServerConfig,
          req,
          res,
          `404 File Not Found, base path: ${devServerConfig.basePath}`,
          `invalid basePath`,
          sendMsg,
        );
      }

      try {
        req.stats = await sys.stat(req.filePath);
        if (req.stats.isFile) {
          return serveFile(devServerConfig, sys, req, res, sendMsg);
        }

        if (req.stats.isDirectory) {
          return serveDirectoryIndex(devServerConfig, sys, req, res, sendMsg);
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
          if (req.stats.isFile) {
            req.filePath = indexFilePath;
            return serveFile(devServerConfig, sys, req, res, sendMsg);
          }
        } catch (e) {
          xSource.push(`notfound error: ${e}`);
        }
      }

      serve404(devServerConfig, req, res, xSource.join(', '), sendMsg);
    } catch (e) {
      serve500(devServerConfig, incomingReq as any, res, e, `not found error`, sendMsg);
    }
  };
}

export function isValidUrlBasePath(basePath: string, url: URL) {
  // normalize the paths to always end with a slash for the check
  if (!url.pathname.endsWith('/')) {
    url.pathname += '/';
  }
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }
  return url.pathname.startsWith(basePath);
}

function normalizeHttpRequest(devServerConfig: d.DevServerConfig, incomingReq: IncomingMessage) {
  const req: d.HttpRequest = {
    method: (incomingReq.method || 'GET').toUpperCase() as any,
    headers: incomingReq.headers as any,
    acceptHeader:
      (incomingReq.headers && typeof incomingReq.headers.accept === 'string' && incomingReq.headers.accept) || '',
    host: (incomingReq.headers && typeof incomingReq.headers.host === 'string' && incomingReq.headers.host) || null,
    url: null,
    searchParams: null,
  };

  const incomingUrl = (incomingReq.url || '').trim() || null;
  if (incomingUrl) {
    if (req.host) {
      req.url = new URL(incomingReq.url, `http://${req.host}`);
    } else {
      req.url = new URL(incomingReq.url, `http://dev.stenciljs.com`);
    }
    req.searchParams = req.url.searchParams;
  }

  if (req.url) {
    const parts = req.url.pathname.replace(/\\/g, '/').split('/');

    req.pathname = parts.map(part => decodeURIComponent(part)).join('/');
    if (req.pathname.length > 0 && !isDevClient(req.pathname)) {
      req.pathname = '/' + req.pathname.substring(devServerConfig.basePath.length);
    }

    req.filePath = normalizePath(path.normalize(path.join(devServerConfig.root, path.relative('/', req.pathname))));
  }

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
