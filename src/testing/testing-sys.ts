import { TestingFs } from './testing-fs';
import { StencilSystem } from '../declarations';
import * as fs from 'fs';
import * as path from 'path';


const relDistPath = path.join(__dirname, '..', '..', 'dist');

const nodeSys = require('../sys/node/index');
export const NodeSystem: NodeSystemSystemConstructor = nodeSys.NodeSystem;

export interface NodeSystemSystemConstructor {
  new (fs: any): StencilSystem;
}

export class TestingSystem extends NodeSystem {

  constructor() {
    const fs = new TestingFs();
    super(fs);
    this.createWatcher = null;
    this.initWorkers(1);
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
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  tmpdir() {
    return path.join(path.resolve('/'), 'tmp', 'testing');
  }

}
