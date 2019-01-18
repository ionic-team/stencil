import * as d from '@declarations';


export function sendMsg(process: NodeJS.Process, msg: d.DevServerMessage) {
  process.send(msg);
}


export function sendError(process: NodeJS.Process, e: any) {
  const msg: d.DevServerMessage = {
    error: {
      message: e
    }
  };

  if (typeof e === 'string') {
    msg.error.message = e + '';

  } else if (e) {
    Object.keys(e).forEach(key => {
      try {
        (msg.error as any)[key] = e[key] + '';
      } catch (idk) {
        console.log(idk);
      }
    });
  }

  sendMsg(process, msg);
}


export function responseHeaders(headers: d.DevResponseHeaders): any {
  return Object.assign({}, DEFAULT_HEADERS, headers);
}


const DEFAULT_HEADERS: d.DevResponseHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Expires': '0',
  'X-Powered-By': 'Stencil Dev Server',
  'Access-Control-Allow-Origin': '*'
};


export function getBrowserUrl(protocol: string, address: string, port: number, baseUrl: string, pathname: string) {
  address = (address === `0.0.0.0`) ? `localhost` : address;
  const portSuffix = (!port || port === 80 || port === 443) ? '' : (':' + port);

  let path = baseUrl;
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }
  path += pathname;

  protocol = protocol.replace(/\:/g, '');

  return `${protocol}://${address}${portSuffix}${path}`;
}


export function getDevServerClientUrl(devServerConfig: d.DevServerConfig, host: string) {
  let address = devServerConfig.address;
  let port = devServerConfig.port;

  if (host) {
    address = host;
    port = null;
  }

  return getBrowserUrl(
    devServerConfig.protocol,
    address,
    port,
    devServerConfig.baseUrl,
    DEV_SERVER_URL
  );
}


export function getContentType(devServerConfig: d.DevServerConfig, filePath: string) {
  const last = filePath.replace(/^.*[/\\]/, '').toLowerCase();
  const ext = last.replace(/^.*\./, '').toLowerCase();

  const hasPath = last.length < filePath.length;
  const hasDot = ext.length < last.length - 1;

  return ((hasDot || !hasPath) && devServerConfig.contentTypes[ext]) || 'application/octet-stream';
}


export function isHtmlFile(filePath: string) {
  filePath = filePath.toLowerCase().trim();
  return (filePath.endsWith('.html') || filePath.endsWith('.htm'));
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
  return pathname.startsWith(DEV_SERVER_URL);
}


export function isOpenInEditor(pathname: string) {
  return pathname === OPEN_IN_EDITOR_URL;
}


export function isInitialDevServerLoad(pathname: string) {
  return pathname === DEV_SERVER_INIT_URL;
}


export function isDevServerClient(pathname: string) {
  return pathname === DEV_SERVER_URL;
}


export const DEV_SERVER_URL = '/~dev-server';

export const DEV_SERVER_INIT_URL = `${DEV_SERVER_URL}-init`;

export const OPEN_IN_EDITOR_URL = `${DEV_SERVER_URL}-open-in-editor`;


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
