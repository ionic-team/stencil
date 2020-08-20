import type * as d from '../declarations';
import type { ServerResponse } from 'http';
import { responseHeaders, sendLogRequest } from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import { serveFile } from './serve-file';
import path from 'path';

let dirTemplate: string = null;

export async function serveDirectoryIndex(
  devServerConfig: d.DevServerConfig,
  sys: d.CompilerSystem,
  req: d.HttpRequest,
  res: ServerResponse,
  sendMsg: d.DevServerSendMessage,
) {
  try {
    const indexFilePath = path.join(req.filePath, 'index.html');

    req.stats = await sys.stat(indexFilePath);
    if (req.stats.isFile) {
      req.filePath = indexFilePath;
      return serveFile(devServerConfig, sys, req, res, sendMsg);
    }
  } catch (e) {}

  if (!req.pathname.endsWith('/')) {
    sendLogRequest(devServerConfig, req, 302, sendMsg);
    res.writeHead(302, {
      location: req.pathname + '/',
    });
    return res.end();
  }

  try {
    const dirFilePaths = await sys.readDir(req.filePath);

    try {
      if (dirTemplate == null) {
        const dirTemplatePath = path.join(devServerConfig.devServerDir, 'templates', 'directory-index.html');
        dirTemplate = sys.readFileSync(dirTemplatePath);
      }
      const files = await getFiles(sys, req.url, dirFilePaths);

      const templateHtml = (await dirTemplate)
        .replace('{{title}}', getTitle(req.pathname))
        .replace('{{nav}}', getName(req.pathname))
        .replace('{{files}}', files);

      sendLogRequest(devServerConfig, req, 200, sendMsg);

      res.writeHead(
        200,
        responseHeaders({
          'content-type': 'text/html; charset=utf-8',
          'x-directory-index': req.pathname,
        }),
      );

      res.write(templateHtml);
      res.end();
    } catch (e) {
      serve500(devServerConfig, req, res, e, 'serveDirectoryIndex', sendMsg);
    }
  } catch (e) {
    serve404(devServerConfig, req, res, 'serveDirectoryIndex', sendMsg);
  }
}

async function getFiles(sys: d.CompilerSystem, baseUrl: URL, dirItemNames: string[]) {
  const items = await getDirectoryItems(sys, baseUrl, dirItemNames);

  if (baseUrl.pathname !== '/') {
    items.unshift({
      isDirectory: true,
      pathname: '../',
      name: '..',
    });
  }

  return items
    .map(item => {
      return `
        <li class="${item.isDirectory ? 'directory' : 'file'}">
          <a href="${item.pathname}">
            <span class="icon"></span>
            <span>${item.name}</span>
          </a>
        </li>`;
    })
    .join('');
}

async function getDirectoryItems(sys: d.CompilerSystem, baseUrl: URL, dirFilePaths: string[]) {
  const items = await Promise.all(
    dirFilePaths.map(async dirFilePath => {
      const fileName = path.basename(dirFilePath);
      const url = new URL(fileName, baseUrl);
      const stats = await sys.stat(dirFilePath);

      const item: DirectoryItem = {
        name: fileName,
        pathname: url.pathname,
        isDirectory: stats.isDirectory,
      };

      return item;
    }),
  );
  return items;
}

function getTitle(pathName: string) {
  return pathName;
}

function getName(pathName: string) {
  const dirs = pathName.split('/');
  dirs.pop();

  let url = '';

  return (
    dirs
      .map((dir, index) => {
        url += dir + '/';
        const text = index === 0 ? `~` : dir;

        return `<a href="${url}">${text}</a>`;
      })
      .join('<span>/</span>') + '<span>/</span>'
  );
}

interface DirectoryItem {
  name: string;
  pathname: string;
  isDirectory: boolean;
}
