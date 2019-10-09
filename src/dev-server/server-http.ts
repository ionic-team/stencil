import * as d from '../declarations';
import { createRequestHandler } from './request-handler';
import { findClosestOpenPort } from './find-closest-port';
import * as http from 'http';
import * as https from 'https';

export async function createHttpServer(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, destroys: d.DevServerDestroy[]) {
  // figure out the port to be listening on
  // by figuring out the first one available
  devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

  // create our request handler
  const reqHandler = createRequestHandler(devServerConfig, sys);

  const credentials = devServerConfig.https;

  let server = credentials ? https.createServer(credentials, reqHandler) : http.createServer(reqHandler);

  destroys.push(() => {
    // close down the serve on destroy
    server.close();
    server = null;
  });

  return server;
}
