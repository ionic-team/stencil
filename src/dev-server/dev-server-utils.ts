import type * as d from '../declarations';
import * as c from './dev-server-constants';
import contentTypes from './content-types-db.json';
import { version } from '../version';

export function responseHeaders(headers: d.DevResponseHeaders): any {
  return { ...DEFAULT_HEADERS, ...headers };
}

const DEFAULT_HEADERS: d.DevResponseHeaders = {
  'cache-control': 'no-cache, no-store, must-revalidate, max-age=0',
  'expires': '0',
  'server': 'Stencil Dev Server ' + version,
  'date': 'Wed, 1 Jan 2000 00:00:00 GMT',
  'access-control-allow-origin': '*',
  'access-control-expose-headers': '*',
};

export function getBrowserUrl(protocol: string, address: string, port: number, basePath: string, pathname: string) {
  address = address === `0.0.0.0` ? `localhost` : address;
  const portSuffix = !port || port === 80 || port === 443 ? '' : ':' + port;

  let path = basePath;
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }
  path += pathname;

  protocol = protocol.replace(/\:/g, '');

  return `${protocol}://${address}${portSuffix}${path}`;
}

export function getDevServerClientUrl(devServerConfig: d.DevServerConfig, host: string, protocol: string) {
  let address = devServerConfig.address;
  let port = devServerConfig.port;

  if (host) {
    address = host;
    port = null;
  }

  return getBrowserUrl(protocol ?? devServerConfig.protocol, address, port, devServerConfig.basePath, c.DEV_SERVER_URL);
}

export function getContentType(filePath: string) {
  const last = filePath.replace(/^.*[/\\]/, '').toLowerCase();
  const ext = last.replace(/^.*\./, '').toLowerCase();

  const hasPath = last.length < filePath.length;
  const hasDot = ext.length < last.length - 1;

  return ((hasDot || !hasPath) && (contentTypes as any)[ext]) || 'application/octet-stream';
}

export function isHtmlFile(filePath: string) {
  filePath = filePath.toLowerCase().trim();
  return filePath.endsWith('.html') || filePath.endsWith('.htm');
}

export function isCssFile(filePath: string) {
  filePath = filePath.toLowerCase().trim();
  return filePath.endsWith('.css');
}

const TXT_EXT = ['css', 'html', 'htm', 'js', 'json', 'svg', 'xml'];

export function isSimpleText(filePath: string) {
  const ext = filePath.toLowerCase().trim().split('.').pop();
  return TXT_EXT.includes(ext);
}

export function isDevClient(pathname: string) {
  return pathname.startsWith(c.DEV_SERVER_URL);
}

export function isDevModule(pathname: string) {
  return pathname.includes(c.DEV_MODULE_URL);
}

export function isOpenInEditor(pathname: string) {
  return pathname === c.OPEN_IN_EDITOR_URL;
}

export function isInitialDevServerLoad(pathname: string) {
  return pathname === c.DEV_SERVER_INIT_URL;
}

export function isDevServerClient(pathname: string) {
  return pathname === c.DEV_SERVER_URL;
}

export function shouldCompress(devServerConfig: d.DevServerConfig, req: d.HttpRequest) {
  if (!devServerConfig.gzip) {
    return false;
  }

  if (req.method !== 'GET') {
    return false;
  }

  const acceptEncoding = req.headers && req.headers['accept-encoding'];
  if (typeof acceptEncoding !== 'string') {
    return false;
  }

  if (!acceptEncoding.includes('gzip')) {
    return false;
  }

  return true;
}

export function sendLogRequest(
  devServerConfig: d.DevServerConfig,
  req: d.HttpRequest,
  status: number,
  sendMsg: d.DevServerSendMessage,
) {
  if (devServerConfig.logRequests) {
    sendMsg({
      requestLog: {
        method: req.method,
        url: req.pathname,
        status,
      },
    });
  }
}
