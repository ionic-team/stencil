import * as d from '../../declarations';


export function createServer(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  if (compilerCtx.localPrerenderServer) return;

  const fs = require('fs');
  const http = require('http');

  compilerCtx.localPrerenderServer = http.createServer((request: any, response: any) => {
    const filePath = getFilePath(outputTarget, request.url);

    fs.readFile(filePath, 'utf8', (err: any, data: any) => {
      if (err) {
        response.write(`<!--localPrerenderServer, error fetching: ${request.url} : ${err} -->`);
      } else {
        response.write(data);
      }
      response.end();
    });

  });

  compilerCtx.localPrerenderServer.listen(PORT);
}


export function getFilePath(outputTarget: d.OutputTargetWww, url: string) {
  const path = require('path');
  const Url = require('url');

  const parsedUrl = Url.parse(url);

  let pathname: string = parsedUrl.pathname;
  if (pathname.charAt(0) !== '/') {
    pathname = '/' + pathname;
  }

  if (pathname.startsWith(outputTarget.baseUrl)) {
    pathname = pathname.substring(outputTarget.baseUrl.length);
  }

  const filePath = path.join(outputTarget.dir, pathname);

  return filePath;
}


export function normalizeUrl(url: string) {
  const Url = require('url');
  const parsedUrl = Url.parse(url);

  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    parsedUrl.protocol = 'http:';
    parsedUrl.host = 'localhost:' + PORT;
    url = Url.format(parsedUrl);
  }

  return url;
}


const PORT = 53536;
