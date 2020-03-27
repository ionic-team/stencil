import * as d from '../declarations';
import { responseHeaders, sendMsg } from './dev-server-utils';
import { serve404 } from './serve-404';
import { serve500 } from './serve-500';
import { serveFile } from './serve-file';
import * as http from 'http';
import path from 'path';
import * as url from 'url';

let dirTemplate: string = null;

export async function serveDirectoryIndex(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse) {
  try {
    const indexFilePath = path.join(req.filePath, 'index.html');

    req.stats = await sys.stat(indexFilePath);
    if (req.stats && req.stats.isFile()) {
      req.filePath = indexFilePath;
      return serveFile(devServerConfig, sys, req, res);
    }
  } catch (e) {}

  if (!req.pathname.endsWith('/')) {
    if (devServerConfig.logRequests) {
      sendMsg(process, {
        requestLog: {
          method: req.method,
          url: req.url,
          status: 302,
        },
      });
    }

    res.writeHead(302, {
      location: req.pathname + '/',
    });
    return res.end();
  }

  try {
    const dirFilePaths = await sys.readdir(req.filePath);

    try {
      if (dirTemplate == null) {
        const dirTemplatePath = path.join(devServerConfig.devServerDir, 'templates', 'directory-index.html');
        dirTemplate = await sys.readFile(dirTemplatePath, 'utf8');
      }
      const files = await getFiles(sys, req.pathname, dirFilePaths);

      const templateHtml = dirTemplate
        .replace('{{title}}', getTitle(req.pathname))
        .replace('{{nav}}', getName(req.pathname))
        .replace('{{files}}', files);

      res.writeHead(
        200,
        responseHeaders({
          'content-type': 'text/html; charset=utf-8',
          'x-directory-index': req.pathname,
        }),
      );

      res.write(templateHtml);
      res.end();

      if (devServerConfig.logRequests) {
        sendMsg(process, {
          requestLog: {
            method: req.method,
            url: req.url,
            status: 200,
          },
        });
      }
    } catch (e) {
      serve500(devServerConfig, req, res, e, 'serveDirectoryIndex');
    }
  } catch (e) {
    serve404(devServerConfig, req, res, 'serveDirectoryIndex');
  }
}

async function getFiles(sys: d.CompilerSystem, urlPathName: string, dirItemNames: string[]) {
  const items = await getDirectoryItems(sys, urlPathName, dirItemNames);

  if (urlPathName !== '/') {
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

async function getDirectoryItems(sys: d.CompilerSystem, urlPathName: string, dirFilePaths: string[]) {
  const items = await Promise.all(
    dirFilePaths.map(async dirFilePath => {
      const fileName = path.basename(dirFilePath);
      const stats = await sys.stat(dirFilePath);

      const item: DirectoryItem = {
        name: fileName,
        pathname: url.resolve(urlPathName, fileName),
        isDirectory: !!(stats && stats.isDirectory()),
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
