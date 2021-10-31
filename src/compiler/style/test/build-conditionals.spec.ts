import type * as d from '@stencil/core/declarations';
import { mockCreateCompiler, MockCompiler } from '../../../testing/mock-compiler';
import path from 'path';
import { getLazyBuildConditionals } from '../../output-targets/dist-lazy/lazy-build-conditionals';

describe('build-conditionals', () => {
  jest.setTimeout(25000);
  let compiler: MockCompiler;
  let config: d.Config = {};

  beforeEach(async () => {
    compiler = await mockCreateCompiler();
    config = compiler.config;
  });
  afterEach(async () => {
    compiler.destroy();
  });

  it('should import function svg/slot build conditionals, remove on rebuild, and add back on rebuild', async () => {
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      import {icon, slot} from './icon';
      @Component({ tag: 'cmp-a', shadow: true }) export class CmpA {
        render() {
          return <div>{icon()}{slot()}</div>
        }
      }`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'slot.tsx'),
      `
        export default () => <slot/>;
      `
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'icon.tsx'),
      `
        import slot from './slot';
        export const icon = () => <svg/>;
        export { slot };
      `
    );

    let r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let conditionals = getLazyBuildConditionals(config, r.components);
    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: true,
        slot: true,
        svg: true,
        vdomRender: true,
      })
    );

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        render() {
          return 'nice'
        }
      }
    `
    );

    r = await compiler.build();
    conditionals = getLazyBuildConditionals(config, r.components);

    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: false,
        slot: false,
        svg: false,
        vdomRender: false,
      })
    );

    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import {icon, slot} from './icon';
      @Component({ tag: 'cmp-a', shadow: true }) export class CmpA {
        render() {
          return <div>{icon()}{slot()}</div>
        }
      }`
    );

    r = await compiler.build();
    conditionals = getLazyBuildConditionals(config, r.components);

    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: true,
        slot: true,
        svg: true,
        vdomRender: true,
      })
    );
  });

  it('should set slot build conditionals, not import unused svg import', async () => {
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      import icon from './icon';
      @Component({ tag: 'cmp-a', shadow: true }) export class CmpA {
        render() {
          return <div><slot/></div>
        }
      }`
    );
    await config.sys.writeFile(path.join(config.srcDir, 'components', 'icon.tsx'), `export default () => <svg/>;`);

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let conditionals = getLazyBuildConditionals(config, r.components);
    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: true,
        slot: true,
        svg: false,
        vdomRender: true,
      })
    );
  });

  it('should set slot build conditionals', async () => {
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        render() {
          return <div><slot/></div>
        }
      }`
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let conditionals = getLazyBuildConditionals(config, r.components);
    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: false,
        slot: true,
        svg: false,
        vdomRender: true,
      })
    );
  });

  it('should set vdom build conditionals', async () => {
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        render() {
          return <div>Hello World</div>
        }
      }`
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let conditionals = getLazyBuildConditionals(config, r.components);
    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: false,
        slot: false,
        svg: false,
        vdomRender: true,
      })
    );
  });

  it('should not set vdom build conditionals', async () => {
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        render() {
          return 'Hello World';
        }
      }`
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    let conditionals = getLazyBuildConditionals(config, r.components);
    expect(conditionals).toEqual(
      expect.objectContaining({
        shadowDom: false,
        slot: false,
        svg: false,
        vdomRender: false,
      })
    );
  });
});
