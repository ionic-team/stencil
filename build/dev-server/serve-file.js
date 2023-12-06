import { Buffer } from 'buffer';
import fs from 'graceful-fs';
import path from 'path';
import * as zlib from 'zlib';
import { version } from '../version';
import * as util from './dev-server-utils';
export async function serveFile(devServerConfig, serverCtx, req, res) {
    try {
        if (util.isSimpleText(req.filePath)) {
            // easy text file, use the internal cache
            let content = await serverCtx.sys.readFile(req.filePath, 'utf8');
            if (devServerConfig.websocket && util.isHtmlFile(req.filePath) && !util.isDevServerClient(req.pathname)) {
                // auto inject our dev server script
                content = appendDevServerClientScript(devServerConfig, req, content);
            }
            else if (util.isCssFile(req.filePath)) {
                content = updateStyleUrls(req.url, content);
            }
            if (util.shouldCompress(devServerConfig, req)) {
                // let's gzip this well known web dev text file
                res.writeHead(200, util.responseHeaders({
                    'content-type': util.getContentType(req.filePath) + '; charset=utf-8',
                    'content-encoding': 'gzip',
                    vary: 'Accept-Encoding',
                }));
                zlib.gzip(content, { level: 9 }, (_, data) => {
                    res.end(data);
                });
            }
            else {
                // let's not gzip this file
                res.writeHead(200, util.responseHeaders({
                    'content-type': util.getContentType(req.filePath) + '; charset=utf-8',
                    'content-length': Buffer.byteLength(content, 'utf8'),
                }));
                res.write(content);
                res.end();
            }
        }
        else {
            // non-well-known text file or other file, probably best we use a stream
            // but don't bother trying to gzip this file for the dev server
            res.writeHead(200, util.responseHeaders({
                'content-type': util.getContentType(req.filePath),
                'content-length': req.stats.size,
            }));
            fs.createReadStream(req.filePath).pipe(res);
        }
        serverCtx.logRequest(req, 200);
    }
    catch (e) {
        serverCtx.serve500(req, res, e, 'serveFile');
    }
}
function updateStyleUrls(url, oldCss) {
    const versionId = url.searchParams.get('s-hmr');
    const hmrUrls = url.searchParams.get('s-hmr-urls');
    if (versionId && hmrUrls) {
        hmrUrls.split(',').forEach((hmrUrl) => {
            urlVersionIds.set(hmrUrl, versionId);
        });
    }
    const reg = /url\((['"]?)(.*)\1\)/gi;
    let result;
    let newCss = oldCss;
    while ((result = reg.exec(oldCss)) !== null) {
        const oldUrl = result[2];
        const parsedUrl = new URL(oldUrl, url);
        const fileName = path.basename(parsedUrl.pathname);
        const versionId = urlVersionIds.get(fileName);
        if (!versionId) {
            continue;
        }
        parsedUrl.searchParams.set('s-hmr', versionId);
        newCss = newCss.replace(oldUrl, parsedUrl.pathname);
    }
    return newCss;
}
const urlVersionIds = new Map();
export function appendDevServerClientScript(devServerConfig, req, content) {
    var _a, _b, _c;
    const devServerClientUrl = util.getDevServerClientUrl(devServerConfig, (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-forwarded-host']) !== null && _b !== void 0 ? _b : req.host, (_c = req.headers) === null || _c === void 0 ? void 0 : _c['x-forwarded-proto']);
    const iframe = `<iframe title="Stencil Dev Server Connector ${version} &#9889;" src="${devServerClientUrl}" style="display:block;width:0;height:0;border:0;visibility:hidden" aria-hidden="true"></iframe>`;
    return appendDevServerClientIframe(content, iframe);
}
export function appendDevServerClientIframe(content, iframe) {
    if (content.includes('</body>')) {
        return content.replace('</body>', `${iframe}</body>`);
    }
    if (content.includes('</html>')) {
        return content.replace('</html>', `${iframe}</html>`);
    }
    return `${content}${iframe}`;
}
//# sourceMappingURL=serve-file.js.map