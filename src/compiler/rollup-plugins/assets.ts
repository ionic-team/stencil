import * as d from '../../declarations';
import { Plugin } from 'rollup';



export function assetsPlugin(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin {
  return {
    resolveId(id: string) {
      if (!NOT_ASSETS.includes(config.sys.path.extname(id).toLowerCase())) {
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


const NOT_ASSETS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.json',
];
