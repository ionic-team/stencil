import { TestingFs } from './testing-fs';
import { StencilSystem } from '../declarations';
import * as fs from 'fs';
import * as path from 'path';


const relDistPath = path.join(__dirname, '..', '..', 'dist');

const nodeSys = require('../sys/node/index');
export const NodeSystem: NodeSystemSystemConstructor = nodeSys.NodeSystem;

export interface NodeSystemSystemConstructor {
  new (fs: any, maxConcurrentWorkers: number): StencilSystem;
  initWorkerFarm(): any;
}

export class TestingSystem extends NodeSystem {

  constructor() {
    super(new TestingFs(), 0);
    this.createWatcher = null;
  }

  get compiler() {
    const compiler = super.compiler;
    compiler.name = 'test';
    compiler.version += '-test';
    return compiler;
  }

  getClientCoreFile(opts: any) {
    const filePath = path.join(relDistPath, 'client', opts.staticName);

    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  tmpdir() {
    return '/tmp/testing';
  }

}
