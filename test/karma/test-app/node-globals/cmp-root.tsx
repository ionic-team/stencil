import { Component, h } from '@stencil/core';
import os from 'os';
import fs from 'fs';

@Component({
  tag: 'node-globals',
})
export class NodeGlobals {
  tmpdir = '';
  fileSystem = false;
  glbl = false;
  buf = false;
  prcs = false;

  componentWillLoad() {
    this.tmpdir = os.tmpdir();
    this.fileSystem = !!fs;
    this.glbl = !!global;
    this.buf = !!Buffer;
    this.prcs = !!process;
  }

  render() {
    return (
      <section>
        <div>
          NODE_ENV: <span id="node_env">{process.env.NODE_ENV}</span>
        </div>
        <div>
          os.tmpdir(): <span id="tmpdir">{this.tmpdir}</span>
        </div>

        <div>
          fs: <span id="fs">{this.fileSystem.toString()}</span>
        </div>

        <div>
          global: <span id="global">{this.glbl.toString()}</span>
        </div>

        <div>
          Buffer: <span id="Buffer">{this.buf.toString()}</span>
        </div>

        <div>
          process: <span id="process">{this.prcs.toString()}</span>
        </div>
      </section>
    );
  }
}
