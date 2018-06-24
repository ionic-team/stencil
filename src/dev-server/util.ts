import * as d from '../declarations';


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


export function getBrowserUrl(devServerConfig: d.DevServerConfig, pathname = '/') {
  const address = (devServerConfig.address === `0.0.0.0`) ? `localhost` : devServerConfig.address;
  const port = (devServerConfig.port === 80 || devServerConfig.port === 443) ? '' : (':' + devServerConfig.port);
  return `${devServerConfig.protocol}://${address}${port}${pathname}`;
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


export function isStaticDevClient(req: d.HttpRequest) {
  return req.pathname.startsWith(DEV_SERVER_URL);
}


export function isInitialDevServerLoad(pathname: string) {
  return pathname === UNREGISTER_SW_URL;
}


export function isDevServerClient(pathname: string) {
  return pathname === DEV_SERVER_URL;
}


export const DEV_SERVER_URL = '/~dev-server';

export const UNREGISTER_SW_URL = `${DEV_SERVER_URL}-init`;


export function shouldCompress(devServerConfig: d.DevServerConfig, req: d.HttpRequest, contentLength: number) {
  if (!devServerConfig.gzip) {
    return false;
  }

  if (req.method !== 'GET') {
    return false;
  }

  if (contentLength < 1024) {
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
