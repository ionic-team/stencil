import * as d from '../../declarations';
import { Plugin } from 'rollup';
import fs from 'fs';
import path from 'path';
import { normalizeFsPath } from '@utils';

const readFile = (id: string) => {
  return new Promise<Buffer>((res, reject) => {
    fs.readFile(id, (error, buffer) => {
      if (error != null) {
        reject(error);
      }
      res(buffer);
    });
  });
}

export const wasmPlugin = (_config: d.Config, _compilerCtx: d.CompilerCtx, _buildCtx: d.BuildCtx, platform: string): Plugin => {
  if (platform === 'hydrate') {
    return {
      name: 'wasmPlugin',
    };
  }
  return {
    name: 'wasmPlugin',

    resolveId(id) {
      if (id === WASM_HELPER_ID) {
        return id;
      }
      return null;
    },

    load(id) {
      if (/\0/.test(id)) {
        return null;
      }
      if (id === WASM_HELPER_ID) {
        return WASM_HELPER;
      }
      if (id.endsWith('.wasm') || id.endsWith('?wasm')) {
        id = normalizeFsPath(id);
        return readFile(id).then(buf => buf.toString('base64'));
      }
      return null;
    },

    transform(base64, id) {
      if (id.endsWith('.wasm') || id.endsWith('?wasm')) {
        id = normalizeFsPath(id);
        const assetName = path.basename(id, '.wasm') + '.wasm';
        const referenceId = this.emitFile({
          type: 'asset',
          source: Buffer.from(base64, 'base64'),
          name: assetName,
        });
        return `
import { createAsyncWasm } from '${WASM_HELPER_ID}';
const wasmPath = /*@__PURE__*/import.meta.ROLLUP_FILE_URL_${referenceId};
const wasmProxy = /*@__PURE__*/createAsyncWasm(wasmPath);
export default wasmProxy;`;
      }
      return null;
    }
  };
};

const WASM_HELPER_ID = '@wasm-helper';

const WASM_HELPER = `
export const createAsyncWasm = (src) => {
  const promise = WebAssembly.instantiateStreaming(fetch(src)).then(obj => obj.instance.exports);
  return new Proxy({}, {
    get(_, exportedName) {
      return (...args) => (
        promise.then(exports => exports[exportedName](...args))
      );
    }
  })
}
`;
