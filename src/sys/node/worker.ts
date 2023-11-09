import * as coreCompiler from '@stencil/core/compiler';
import * as nodeApi from '@sys-api-node';

import { initNodeWorkerThread } from './node-worker-thread';

const nodeSys = nodeApi.createNodeSys({ process: process });
const msgHandler = coreCompiler.createWorkerMessageHandler(nodeSys);

initNodeWorkerThread(process, msgHandler);
