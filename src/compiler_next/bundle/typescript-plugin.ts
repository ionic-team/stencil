import { BundleOptions } from './bundle-interface';
import { Plugin, TransformResult } from 'rollup';


export const typescriptPlugin = (bundleOpts: BundleOptions): Plugin => {
  return {
    name: `${bundleOpts.id}TypescriptPlugin`,

    transform(code, id) {
      if (!id.endsWith('.tsx') && !id.endsWith('.ts')) {
        return null;
      }

      const transformResult: TransformResult = {
        code,
        map: null
      };

      const tsSourceFile = bundleOpts.tsBuilder.getSourceFile(id);

      bundleOpts.tsBuilder.emit(tsSourceFile,
        (filePath, data) => {
          if (filePath.endsWith('.js')) {
            transformResult.code = data;

          } else if (filePath.endsWith('.map')) {
            transformResult.map = data;
          }
        },
        undefined,
        undefined,
        bundleOpts.customTransformers
      );

      return transformResult;
    }
  };
};
