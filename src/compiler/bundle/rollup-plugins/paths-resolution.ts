import { CompilerCtx, Config } from '../../../declarations';
import { getUserTsConfig } from '../../transpile/compiler-options';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export default function pathsResolver(config: Config, compilerCtx: CompilerCtx) {
  const tsconfig: ts.CompilerOptions = getUserTsConfig(config, compilerCtx);

  return {
    name: 'pathsResolverPlugin',

    async resolveId(importee: string, importer: string) {
      importee = normalizePath(importee);
      importer = normalizePath(importer);

      if (!importer) {
        return null;
      }

      // Parse each rule from tsconfig
      for (const rule in tsconfig.paths) {
        // The rule with the wildcard
        const standaloneRule = rule.replace(/\*$/, '');

        if (importee.indexOf(standaloneRule) === 0) {
          // Get the wildcard part from importee
          const wildcard = importee.slice(standaloneRule.length);

          // Parse each sub-rule of a rule
          for (const subrule of tsconfig.paths[rule]) {
            // Build the subrule replacing the wildcard with actual path
            const enrichedSubrule: string = subrule.replace(/\*$/, wildcard);

            // Get the absolute path
            let finalPath = config.sys.path.join(config.rootDir, enrichedSubrule);

            // Replace src with collection dir
            finalPath = finalPath.replace(config.srcDir, config.collectionDir);

            // Add the extension
            if (finalPath.indexOf('.js') !== finalPath.length - 3) {
              finalPath += '.js';
            }

            const hasAccess = compilerCtx.fs.access(finalPath);

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
