import * as d from '@declarations';
import { sys } from '@sys';
import { Plugin } from 'rollup';



export function assetsPlugin(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin {

  return {
    resolveId(id: string) {
      if (isAsset(id)) {
        return id;
      }
      return null;
    },
    transform() {
      const assetId = this.emitAsset('test.ext', 'hello world');
      return `export default import.meta.ROLLUP_ASSET_URL_${assetId};`;
    },
    name: 'assetsPlugin'
  };
}

function isAsset(id: string) {
  return !NOT_ASSETS.includes(sys.path.extname(id).toLowerCase());
}

const NOT_ASSETS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.json',
];
