import { CompilerCtx } from '@stencil/core/declarations';
import { mockCompilerCtx, mockValidatedConfig } from '@stencil/core/testing';
import path from 'path';
import ts from 'typescript';

import { patchTypescript } from '../../sys/typescript/typescript-sys';
import { rewriteAliasedDTSImportPaths, rewriteAliasedSourceFileImportPaths } from '../rewrite-aliased-paths';
import { transpileModule } from './transpile';

async function pathTransformTranspile(component: string) {
  const compilerContext: CompilerCtx = mockCompilerCtx();
  const config = mockValidatedConfig();

  patchTypescript(config, compilerContext.fs);

  const mockPathsConfig: ts.CompilerOptions = {
    paths: {
      '@namespace': [path.join(config.rootDir, 'name/space.ts')],
      '@namespace/subdir': [path.join(config.rootDir, 'name/space/subdir.ts')],
    },
    declaration: true,
  };

  // we need to have files in the `inMemoryFs` which TypeScript
  // can resolve, otherwise it won't find the module and won't
  // transform the module ID
  await compilerContext.fs.writeFile(path.join(config.rootDir, 'name/space.ts'), 'export const foo = x => x');
  await compilerContext.fs.writeFile(path.join(config.rootDir, 'name/space/subdir.ts'), 'export const bar = x => x;');

  return transpileModule(
    component,
    null,
    compilerContext,
    [rewriteAliasedSourceFileImportPaths],
    [],
    [rewriteAliasedDTSImportPaths],
    mockPathsConfig
  );
}

describe('rewrite alias module paths transform', () => {
  it('should rewrite an aliased module identifier', async () => {
    const t = await pathTransformTranspile(`
      import { foo } from "@namespace";
      export class CmpA {
        render() {
          return <some-cmp>{ foo("bar") }</some-cmp>
        }
      }
    `);

    expect(t.outputText).toBe(
      'import { foo } from "./name/space";export class CmpA { render() { return h("some-cmp", null, foo("bar")); }}'
    );
  });

  it('should rewrite a nested aliased modules identifier', async () => {
    const t = await pathTransformTranspile(`
      import { foo } from "@namespace/subdir";
      export class CmpA {
        render() {
          return <some-cmp>{ foo("bar") }</some-cmp>
        }
      }
    `);

    expect(t.outputText).toBe(
      'import { foo } from "./name/space/subdir";export class CmpA { render() { return h("some-cmp", null, foo("bar")); }}'
    );
  });

  it('should rewrite an aliased modules identifier in a .d.ts', async () => {
    const t = await pathTransformTranspile(`
      import { Foo } from "@namespace";

      export class CmpA {
        @Prop()
        field: Foo = { bar: "yes" };

        render() {
          return <some-cmp />
        }
      }
    `);

    expect(t.declarationOutputText).toBe(
      'import { Foo } from "./name/space";export declare class CmpA { field: Foo; render(): any;}'
    );
  });

  it('should rewrite a nested aliased modules identifier in a .d.ts', async () => {
    const t = await pathTransformTranspile(`
      import { Foo } from "@namespace/subdir";

      export function fooUtil(foo: Foo): Foo {
        return foo
      }
    `);

    expect(t.declarationOutputText).toBe(
      'import { Foo } from "./name/space/subdir";export declare function fooUtil(foo: Foo): Foo;'
    );
  });

  it('should rewrite multiple aliased paths in the same module', async () => {
    const t = await pathTransformTranspile(`
      import { Foo } from "@namespace/subdir";
      import { Bar } from "@namespace";

      export function fooUtil(foo: Foo): Bar {
        return foo.toBar()
      }
    `);

    expect(t.declarationOutputText).toBe(
      'import { Foo } from "./name/space/subdir";import { Bar } from "./name/space";export declare function fooUtil(foo: Foo): Bar;'
    );
  });

  it('should rewrite aliased paths while leaving non-aliased paths alone', async () => {
    const t = await pathTransformTranspile(`
      import { Foo } from "@namespace/subdir";
      import { Bar } from "./name/space";

      export function fooUtil(foo: Foo): Bar {
        return foo.toBar()
      }
    `);

    expect(t.declarationOutputText).toBe(
      'import { Foo } from "./name/space/subdir";import { Bar } from "./name/space";export declare function fooUtil(foo: Foo): Bar;'
    );
  });
});
