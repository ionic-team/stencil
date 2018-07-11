import * as d from '../declarations';
import { NodeFs } from '../sys/node/node-fs';
import { sendError } from './util';
import { startDevServerWorker } from './start-server-worker';
import * as path from 'path';


async function startServer(devServerConfig: d.DevServerConfig) {
  // received a message from main to start the server
  try {
    const fs = new NodeFs();
    devServerConfig.contentTypes = await loadContentTypes(fs);
    startDevServerWorker(process, devServerConfig, fs);

  } catch (e) {
    sendError(process, e);
  }
}


async function loadContentTypes(fs: NodeFs) {
  const contentTypePath = path.join(__dirname, 'content-type-db.json');
  const contentTypeJson = await fs.readFile(contentTypePath);
  return JSON.parse(contentTypeJson);
}


process.on('message', (msg: d.DevServerMessage) => {
  if (msg.startServer) {
    startServer(msg.startServer);
  }
});


process.on('unhandledRejection', (e: any) => {
  console.log(e);
});
