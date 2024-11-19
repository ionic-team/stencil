import { h } from '@stencil/core';
import os from 'os';
import fs from 'fs';
export class NodeGlobals {
  constructor() {
    this.tmpdir = '';
    this.fileSystem = false;
    this.glbl = false;
    this.buf = false;
    this.prcs = false;
  }
  componentWillLoad() {
    this.tmpdir = os.tmpdir();
    this.fileSystem = !!fs;
    this.glbl = !!global;
    this.buf = !!Buffer;
    this.prcs = !!process;
  }
  render() {
    return (h("section", null, h("div", null, "NODE_ENV: ", h("span", { id: "node_env" }, process.env.NODE_ENV)), h("div", null, "os.tmpdir(): ", h("span", { id: "tmpdir" }, this.tmpdir)), h("div", null, "fs: ", h("span", { id: "fs" }, this.fileSystem.toString())), h("div", null, "global: ", h("span", { id: "global" }, this.glbl.toString())), h("div", null, "Buffer: ", h("span", { id: "Buffer" }, this.buf.toString())), h("div", null, "process: ", h("span", { id: "process" }, this.prcs.toString()))));
  }
  static get is() { return "node-globals"; }
}
