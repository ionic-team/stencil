import { transpileModule } from './transpile';
import ts from 'typescript'
import { mockValidatedConfig } from '@stencil/core/testing'
import {ValidatedConfig} from '@stencil/core/declarations';
import {rewriteAliasedSourceFileImportPaths} from '../rewrite-aliased-paths';

function getConfig(): ValidatedConfig {
  const config = mockValidatedConfig();
  config.transformAliasedImportPaths = true;
  return config
}

const MOCK_PATHS: ts.CompilerOptions = {
  paths: {
    "@namespace": ["name/space.ts"],
    "@namespace/subdir": ["name/space/subdir.ts"],
  }
}

function pathTransformTranspile (component: string) {
  const config = getConfig();

  return transpileModule(
    component,
    config,
    undefined,
    [rewriteAliasedSourceFileImportPaths()],
    [],
    MOCK_PATHS,
  );
}


describe('rewrite alias module paths transform', () => {

  it('should rewrite an aliased modules identifier', () => {
    const t = pathTransformTranspile(`
      import { foo } from "@namespace";
      export class CmpA {
        render() {
          return <some-cmp checked="true"/>
        }
      }
    `);

    console.log(t.outputText);
  });

  it('should rewrite an aliased modules identifier in a .dts', () => {
  });
});
