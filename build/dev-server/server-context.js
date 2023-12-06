import fs from 'graceful-fs';
import path from 'path';
import util from 'util';
import { responseHeaders } from './dev-server-utils';
export function createServerContext(sys, sendMsg, devServerConfig, buildResultsResolves, compilerRequestResolves) {
    const logRequest = (req, status) => {
        if (devServerConfig) {
            sendMsg({
                requestLog: {
                    method: req.method || '?',
                    url: req.pathname || '?',
                    status,
                },
            });
        }
    };
    const serve500 = (req, res, error, xSource) => {
        try {
            res.writeHead(500, responseHeaders({
                'content-type': 'text/plain; charset=utf-8',
                'x-source': xSource,
            }));
            res.write(util.inspect(error));
            res.end();
            logRequest(req, 500);
        }
        catch (e) {
            sendMsg({ error: { message: 'serve500: ' + e } });
        }
    };
    const serve404 = (req, res, xSource, content = null) => {
        try {
            if (req.pathname === '/favicon.ico') {
                const defaultFavicon = path.join(devServerConfig.devServerDir, 'static', 'favicon.ico');
                res.writeHead(200, responseHeaders({
                    'content-type': 'image/x-icon',
                    'x-source': `favicon: ${xSource}`,
                }));
                const rs = fs.createReadStream(defaultFavicon);
                rs.on('error', (err) => {
                    res.writeHead(404, responseHeaders({
                        'content-type': 'text/plain; charset=utf-8',
                        'x-source': `createReadStream error: ${err}, ${xSource}`,
                    }));
                    res.write(util.inspect(err));
                    res.end();
                });
                rs.pipe(res);
                return;
            }
            if (content == null) {
                content = ['404 File Not Found', 'Url: ' + req.pathname, 'File: ' + req.filePath].join('\n');
            }
            res.writeHead(404, responseHeaders({
                'content-type': 'text/plain; charset=utf-8',
                'x-source': xSource,
            }));
            res.write(content);
            res.end();
            logRequest(req, 400);
        }
        catch (e) {
            serve500(req, res, e, xSource);
        }
    };
    const serve302 = (req, res, pathname = null) => {
        logRequest(req, 302);
        res.writeHead(302, { location: pathname || devServerConfig.basePath || '/' });
        res.end();
    };
    const getBuildResults = () => new Promise((resolve, reject) => {
        if (serverCtx.isServerListening) {
            buildResultsResolves.push({ resolve, reject });
            sendMsg({ requestBuildResults: true });
        }
        else {
            reject('dev server closed');
        }
    });
    const getCompilerRequest = (compilerRequestPath) => new Promise((resolve, reject) => {
        if (serverCtx.isServerListening) {
            compilerRequestResolves.push({
                path: compilerRequestPath,
                resolve,
                reject,
            });
            sendMsg({ compilerRequestPath });
        }
        else {
            reject('dev server closed');
        }
    });
    const serverCtx = {
        connectorHtml: null,
        dirTemplate: null,
        getBuildResults,
        getCompilerRequest,
        isServerListening: false,
        logRequest,
        prerenderConfig: null,
        serve302,
        serve404,
        serve500,
        sys,
    };
    return serverCtx;
}
//# sourceMappingURL=server-context.js.map