import * as d from '../declarations';
import { sendMsg } from './dev-server-utils';
import { startDevServerWorker } from './start-server-worker';
import fs from 'fs';
import path from 'path';
import util from 'util';


async function startServer(devServerConfig: d.DevServerConfig) {
  // received a message from main to start the server
  try {
    devServerConfig.contentTypes = await loadContentTypes(devServerConfig);
    startDevServerWorker(process, devServerConfig);

  } catch (e) {
    sendMsg(process, {
      serverStarted: {
        browserUrl: null,
        initialLoadUrl: null,
        error: String(e)
      }
    });
  }
}


async function loadContentTypes(devServerConfig: d.DevServerConfig) {
  const contentTypePath = path.join(devServerConfig.devServerDir, 'content-type-db.json');
  const readFile = util.promisify(fs.readFile);
  const contentTypeJson = await readFile(contentTypePath, 'utf8');
  return JSON.parse(contentTypeJson);
}


process.on('message', (msg: d.DevServerMessage) => {
  if (msg.startServer) {
    startServer(msg.startServer);
  }
});


process.on('unhandledRejection', (e: any) => {
  console.log('server worker error', e);
});
