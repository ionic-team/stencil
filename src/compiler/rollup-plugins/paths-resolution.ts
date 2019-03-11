import * as d from '../../declarations';
import { normalizePath } from '@utils';
import ts from 'typescript';


export function pathsResolver(config: d.Config, compilerCtx: d.CompilerCtx, tsCompilerOptions: ts.CompilerOptions) {
  const extensions = [
    'ts',
    'tsx'
  ];

  return {
    name: 'pathsResolverPlugin',

    resolveId(importee: string, importer: string) {
      if (!importer || /\0/.test(importee)) {
        // ignore IDs with null character, these belong to other plugins
        return null;
      }
      importee = normalizePath(importee);
      importer = normalizePath(importer);

      const paths = tsCompilerOptions.paths || {};

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

            const finalPath = config.sys.path.join(config.rootDir, enrichedSubrule);

            for (let i = 0; i < extensions.length; i++) {
              const moduleFile = compilerCtx.moduleMap.get(`${finalPath}.${extensions[i]}`);

              if (moduleFile) {
                return moduleFile.jsFilePath;
              }
            }
          }
        }
      }

      return null;
    },
  };
}
