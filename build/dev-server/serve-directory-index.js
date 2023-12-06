import path from 'path';
import { responseHeaders } from './dev-server-utils';
import { serveFile } from './serve-file';
export async function serveDirectoryIndex(devServerConfig, serverCtx, req, res) {
    const indexFilePath = path.join(req.filePath, 'index.html');
    req.stats = await serverCtx.sys.stat(indexFilePath);
    if (req.stats.isFile) {
        req.filePath = indexFilePath;
        return serveFile(devServerConfig, serverCtx, req, res);
    }
    if (!req.pathname.endsWith('/')) {
        return serverCtx.serve302(req, res, req.pathname + '/');
    }
    try {
        const dirFilePaths = await serverCtx.sys.readDir(req.filePath);
        try {
            if (serverCtx.dirTemplate == null) {
                const dirTemplatePath = path.join(devServerConfig.devServerDir, 'templates', 'directory-index.html');
                serverCtx.dirTemplate = serverCtx.sys.readFileSync(dirTemplatePath);
            }
            const files = await getFiles(serverCtx.sys, req.url, dirFilePaths);
            const templateHtml = serverCtx.dirTemplate
                .replace('{{title}}', getTitle(req.pathname))
                .replace('{{nav}}', getName(req.pathname))
                .replace('{{files}}', files);
            serverCtx.logRequest(req, 200);
            res.writeHead(200, responseHeaders({
                'content-type': 'text/html; charset=utf-8',
                'x-directory-index': req.pathname,
            }));
            res.write(templateHtml);
            res.end();
        }
        catch (e) {
            return serverCtx.serve500(req, res, e, 'serveDirectoryIndex');
        }
    }
    catch (e) {
        return serverCtx.serve404(req, res, 'serveDirectoryIndex');
    }
}
async function getFiles(sys, baseUrl, dirItemNames) {
    const items = await getDirectoryItems(sys, baseUrl, dirItemNames);
    if (baseUrl.pathname !== '/') {
        items.unshift({
            isDirectory: true,
            pathname: '../',
            name: '..',
        });
    }
    return items
        .map((item) => {
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
async function getDirectoryItems(sys, baseUrl, dirFilePaths) {
    const items = await Promise.all(dirFilePaths.map(async (dirFilePath) => {
        const fileName = path.basename(dirFilePath);
        const url = new URL(fileName, baseUrl);
        const stats = await sys.stat(dirFilePath);
        const item = {
            name: fileName,
            pathname: url.pathname,
            isDirectory: stats.isDirectory,
        };
        return item;
    }));
    return items;
}
function getTitle(pathName) {
    return pathName;
}
function getName(pathName) {
    const dirs = pathName.split('/');
    dirs.pop();
    let url = '';
    return (dirs
        .map((dir, index) => {
        url += dir + '/';
        const text = index === 0 ? `~` : dir;
        return `<a href="${url}">${text}</a>`;
    })
        .join('<span>/</span>') + '<span>/</span>');
}
//# sourceMappingURL=serve-directory-index.js.map