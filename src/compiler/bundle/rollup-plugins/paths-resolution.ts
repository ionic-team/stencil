import { CompilerCtx, Config } from '../../../declarations';
import { getUserTsConfig } from '../../transpile/compiler-options';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export default async function pathsResolver(config: Config, compilerCtx: CompilerCtx) {
  const tsconfig: ts.CompilerOptions = await getUserTsConfig(config, compilerCtx);

  return {
    name: 'pathsResolverPlugin',

    async resolveId(importee: string, importer: string) {
      importee = normalizePath(importee);
      importer = normalizePath(importer);

      if (!importer) {
        return null;
      }

      const paths = tsconfig.paths || {};

      // Parse each rule from tsconfig
      for (const rule in paths) {
        const normalizedRule = normalizePath(rule);

        // The rule without the wildcard
        const standaloneRule = normalizedRule.replace(/\*$/, '');

        if (importee.indexOf(standaloneRule) === 0) {
          // Get the wildcard part from importee
          const wildcard = importee.slice(standaloneRule.length);

          // Parse each sub-rule of a rule
          for (const subrule of paths[rule]) {
            const normalizedSubrule = normalizePath(subrule);

            // Build the subrule replacing the wildcard with actual path
            const enrichedSubrule: string = normalizePath(normalizedSubrule.replace(/\*$/, wildcard));

            // Get the absolute path to the src
            let finalPath = config.sys.path.join(config.rootDir, enrichedSubrule);

            // Replace src with collection dir
            finalPath = finalPath.replace(config.srcDir, config.collectionDir);

            // Add the extension
            if (finalPath.indexOf('.js') !== finalPath.length - 3) {
              finalPath += '.js';
            }

            const hasAccess = compilerCtx.fs.access(normalizePath(finalPath));

            if (hasAccess) {
              return finalPath;
            }
          }
        }
      }

      return null;
    },
  };
}
