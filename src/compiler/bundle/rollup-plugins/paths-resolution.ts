import * as d from '../../../declarations';
import { getUserCompilerOptions } from '../../transpile/compiler-options';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export default async function pathsResolver(config: d.Config, compilerCtx: d.CompilerCtx, testTsconfig?: ts.CompilerOptions) {
  const tsconfig: ts.CompilerOptions = testTsconfig || await getUserCompilerOptions(config, compilerCtx);

  const extensions = [
    'ts',
    'tsx'
  ];

  return {
    name: 'pathsResolverPlugin',

    resolveId(importee: string, importer: string) {
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
