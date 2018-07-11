import * as d from '../declarations';
import { createRequestHandler } from './request-handler';
import { findClosestOpenPort } from './find-closest-port';
import { getSSL } from './ssl';
import * as http from 'http';
import * as https from 'https';


export async function createHttpServer(devServerConfig: d.DevServerConfig, fs: d.FileSystem, destroys: d.DevServerDestroy[]) {
  // figure out the port to be listening on
  // by figuring out the first one available
  devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

  // create our request handler
  const reqHandler = createRequestHandler(devServerConfig, fs);

  let server: http.Server;

  if (devServerConfig.protocol === 'https') {
    // https server
    server = https.createServer(await getSSL(), reqHandler) as any;

  } else {
    // http server
    server = http.createServer(reqHandler);
  }

  destroys.push(() => {
    // close down the serve on destroy
    server.close();
    server = null;
  });

  return server;
}
