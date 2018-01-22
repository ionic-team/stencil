import { TestingFs } from './testing-fs';
import { StencilSystem } from '../declarations';
import * as fs from 'fs';
import * as path from 'path';


const nodeSys = require('../sys/node/index');
export const NodeSystem: NodeSystemSystemConstructor = nodeSys.NodeSystem;

export interface NodeSystemSystemConstructor {
  new (fs: any): StencilSystem;
}


export class TestingSystem extends NodeSystem {

  constructor() {
    super(new TestingFs());
  }

  get compiler() {
    const compiler = super.compiler;
    compiler.name = 'test';
    compiler.version += '-test';
    return compiler;
  }

  getClientCoreFile(opts: any) {
    const filePath = path.join(__dirname, '../../dist/client', opts.staticName);

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
