import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import { createRequestHandler } from './request-handler';
export function createHttpServer(devServerConfig, serverCtx) {
    // create our request handler
    const reqHandler = createRequestHandler(devServerConfig, serverCtx);
    const credentials = devServerConfig.https;
    return credentials ? https.createServer(credentials, reqHandler) : http.createServer(reqHandler);
}
export async function findClosestOpenPort(host, port) {
    async function t(portToCheck) {
        const isTaken = await isPortTaken(host, portToCheck);
        if (!isTaken) {
            return portToCheck;
        }
        return t(portToCheck + 1);
    }
    return t(port);
}
function isPortTaken(host, port) {
    return new Promise((resolve, reject) => {
        const tester = net
            .createServer()
            .once('error', () => {
            resolve(true);
        })
            .once('listening', () => {
            tester
                .once('close', () => {
                resolve(false);
            })
                .close();
        })
            .on('error', (err) => {
            reject(err);
        })
            .listen(port, host);
    });
}
//# sourceMappingURL=server-http.js.map