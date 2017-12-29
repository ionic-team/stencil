import { BuildContext, ManifestBundle } from '../../../util/interfaces';
import { normalizePath } from '../../util';


export default function bundleInputEntry(ctx: BuildContext, manifestBundle: ManifestBundle) {
  // load the entry input file for the component
  // every component in the bundle already has
  // es module exports previously added from typescript transforms
  // any one of the transpiled components could act as the entry input

  return {
    name: 'bundleInputEntry',

    resolveId(importee: string) {
      if (importee !== manifestBundle.cacheKey) {
        // this importee isn't the entry input
        return null;
      }

      // keep the cache key as the id
      return manifestBundle.cacheKey;
    },

    load(id: string) {
      if (id !== manifestBundle.cacheKey) {
        // this import isn't the entry input
        return null;
      }

      // use the first component as the entry input
      // any one of the component files could act as the entry input
      const jsFilePath = normalizePath(manifestBundle.moduleFiles[0].jsFilePath);

      // return the transpiled JS source text
      // which will already have the exports that
      // rollup uses to bundle all the components together
      return ctx.jsFiles[jsFilePath] || `/* unable to load js file for ${id} */`;
    }

  };
}
