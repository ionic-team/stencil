import { normalizePath } from '@utils';
import { TestingFs } from './testing-fs';
import { StencilSystem } from '../declarations';
import fs from 'fs';
import path from 'path';


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
    this.path = Object.assign({}, path);

    const orgPathJoin = path.join;
    this.path.join = function(...paths) {
      return normalizePath(orgPathJoin.apply(path, paths));
    };

    this.createFsWatcher = null;
    this.initWorkers(1, 1);
  }

  get compiler() {
    const compiler = super.compiler;
    compiler.name = 'test';
    compiler.version += '-test';
    return compiler;
  }

  getClientPath(staticName: string) {
    return normalizePath(path.join(relDistPath, 'client', staticName));
  }

  getClientCoreFile(opts: any) {
    const filePath = this.getClientPath(opts.staticName);

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
