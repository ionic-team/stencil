import * as d from '../../../declarations';
import { normalizePath } from '../../util';
import ts from 'typescript';


export default function pathsResolver(config: d.Config, compilerCtx: d.CompilerCtx, tsCompilerOptions: ts.CompilerOptions) {
  const extensions = [
    'ts',
    'tsx'
  ];

  return {
    name: 'pathsResolverPlugin',

    resolveId(importee: string, importer: string) {
      if (!importer) {
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

            const finalPath = normalizePath(config.sys.path.join(config.rootDir, enrichedSubrule));

            const moduleFiles = compilerCtx.moduleFiles;

            for (let i = 0; i < extensions.length; i++) {
              const moduleFile = moduleFiles[`${finalPath}.${extensions[i]}`];

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
