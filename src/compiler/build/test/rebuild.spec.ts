import { build } from '../build';
import { BuildConfig, BuildContext, BuildResults, ComponentRegistry } from '../../../util/interfaces';
import { mockBuildConfig, mockFs } from '../../../testing/mocks';
import { parseComponentRegistry } from '../../../util/data-parse';
import { validateBuildConfig } from '../../../util/validate-config';
import * as path from 'path';


describe('rebuild', () => {

  it('should save app files, but not resave when unchanged', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    writeFileSync('/src/index.html', `<cmp-a></cmp-a>`);

    return build(config, ctx).then(r => {
      expect(wroteFile(r, 'app.js')).toBe(true);
      expect(wroteFile(r, 'app.registry.json')).toBe(true);
      expect(wroteFile(r, 'app.core.pf.js')).toBe(true);
      expect(wroteFile(r, 'app.core.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        ctx.watcher.$triggerEvent('change', '/src/index.html');

      }).then((r: BuildResults) => {
        expect(wroteFile(r, 'app.js')).toBe(false);
        expect(wroteFile(r, 'app.registry.json')).toBe(false);
        expect(wroteFile(r, 'app.core.pf.js')).toBe(false);
        expect(wroteFile(r, 'app.core.js')).toBe(false);
      });
    });
  });

  it('should rebuild for two changed modules', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB {}`);
    writeFileSync('/src/cmp-c.tsx', `@Component({ tag: 'cmp-c' }) export class CmpC {}`);

    return build(config, ctx).then(() => {
      expect(ctx.isChangeBuild).toBeFalsy();

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { constructor() { 'hi'; } }`);
        writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB { constructor() { 'hi'; }}`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');
        ctx.watcher.$triggerEvent('change', '/src/cmp-b.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBe(true);
        expect(ctx.transpileBuildCount).toBe(2);
        expect(ctx.moduleBundleCount).toBe(2);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
        expect(wroteFile(r, 'cmp-c.js')).toBe(false);
      });
    });
  });

  it('should do a full rebuild when 1 file changed, and 1 file added', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);

    return build(config, ctx).then(() => {
      expect(ctx.isChangeBuild).toBeFalsy();

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        config.bundles = [
          { components: ['cmp-a'] },
          { components: ['cmp-b'] }
        ];

        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { constructor() { window.alert(88); } }`);
        writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB {}`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');
        ctx.watcher.$triggerEvent('add', '/src/cmp-b.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBeFalsy();
        expect(ctx.transpileBuildCount).toBe(2);
        expect(ctx.moduleBundleCount).toBe(2);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
      });
    });
  });

  it('should do a full rebuild when files are deleted', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB {}`);

    return build(config, ctx).then(() => {
      expect(ctx.isChangeBuild).toBeFalsy();

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        config.bundles = [ { components: ['cmp-a'] }];
        unlinkSync('/src/cmp-b.tsx');
        ctx.watcher.$triggerEvent('unlink', '/src/cmp-b.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBeFalsy();
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);

        expect(wroteFile(r, 'cmp-a.js')).toBe(false);
        expect(wroteFile(r, 'cmp-b.js')).toBe(false);
      });
    });
  });

  it('should do a full rebuild when files are added', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] }];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);

    return build(config, ctx).then(() => {
      expect(ctx.isChangeBuild).toBeFalsy();

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB {}`);
        config.bundles = [
          { components: ['cmp-a'] },
          { components: ['cmp-b'] }
        ];
        ctx.watcher.$triggerEvent('add', '/src/cmp-b.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBeFalsy();
        expect(ctx.transpileBuildCount).toBe(2);
        expect(ctx.moduleBundleCount).toBe(2);

        expect(wroteFile(r, 'cmp-a.js')).toBe(false);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
      });
    });
  });

  it('should build styles, but not rebuild on non-component file changes', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA { constructor() { var s = new MyService(); } }`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);
    writeFileSync('/src/cmp-b.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB { constructor() { var s = new MyService(); } }`);
    writeFileSync('/src/cmp-b.scss', `body { color: red; }`);
    writeFileSync('/src/service.tsx', `export class MyService {}`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(3);
      expect(ctx.moduleBundleCount).toBe(2);
      expect(ctx.sassBuildCount).toBe(2);
      expect(ctx.styleBundleCount).toBe(2);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/service.tsx', `export class MyService { constructor(){ window.alert(88); } }`);
        ctx.watcher.$triggerEvent('change', '/src/service.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBe(true);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(2);
        expect(ctx.sassBuildCount).toBe(0);
        expect(ctx.styleBundleCount).toBe(0);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
      });
    });
  });

  it('should rebundle both cmp-a and cmp-b when non-component module has changed', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-a' }) export class CmpA { constructor() { var s = new MyService(); } }`);
    writeFileSync('/src/cmp-b.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-b' }) export class CmpB { constructor() { var s = new MyService(); } }`);
    writeFileSync('/src/service.tsx', `export class MyService {}`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(3);
      expect(ctx.moduleBundleCount).toBe(2);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/service.tsx', `export class MyService { constructor(){ window.alert(88); } }`);
        ctx.watcher.$triggerEvent('change', '/src/service.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBe(true);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(2);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
        expect(wroteFile(r, 'service.js')).toBe(false);
      });
    });
  });

  it('should not rebuild cmp-a when only cmp-b changed', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-a' }) export class CmpA {}`);
    writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b' }) export class CmpB {}`);
    writeFileSync('/src/service.tsx', `export class MyService { test() { 'test'; } }`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(3);
      expect(ctx.moduleBundleCount).toBe(2);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);
      expect(wroteFile(r, 'service.js')).toBe(false);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-b.tsx', `
          import { MyService } from './service';
          @Component({ tag: 'cmp-b' })
          export class CmpB {
            constructor() {
              const myService = new MyService();
              myService.test();
            }
          }`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-b.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBe(true);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);

        expect(wroteFile(r, 'cmp-a.js')).toBe(false);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
        expect(wroteFile(r, 'service.js')).toBe(false);
      });
    });
  });

  it('should re-bundle styles when the changed sass file is not a direct component sass file', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `@import "variables"; body { color: $color; }`);
    writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB {}`);
    writeFileSync('/src/cmp-b.scss', `@import "variables"; body { color: $color; }`);
    writeFileSync('/src/variables.scss', `$color: red;`);

    return build(config, ctx).then(() => {
      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/variables.scss', `$color: blue;`);
        ctx.watcher.$triggerEvent('change', '/src/variables.scss');

      }).then((r: BuildResults) => {
        expect(r.diagnostics.length).toBe(0);
        expect(ctx.transpileBuildCount).toBe(0);
        expect(ctx.moduleBundleCount).toBe(0);
        expect(ctx.sassBuildCount).toBe(2);
        expect(ctx.styleBundleCount).toBe(2);
      });
    });
  });

  it('should not re-transpile, re-bundle modules or re-bundle styles for cmp-b if only cmp-a module changed', () => {
    ctx = {};
    config.bundles = [
      { components: ['cmp-a'] },
      { components: ['cmp-b'] }
    ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);
    writeFileSync('/src/cmp-b.tsx', `@Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB {}`);
    writeFileSync('/src/cmp-b.scss', `body { color: blue; }`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(2);
      expect(ctx.moduleBundleCount).toBe(2);
      expect(ctx.sassBuildCount).toBe(2);
      expect(ctx.styleBundleCount).toBe(2);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA { constructor() { 'file change'; } }`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');

      }).then((r: BuildResults) => {
        expect(r.diagnostics.length).toBe(0);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);
        expect(ctx.sassBuildCount).toBe(1);
        expect(ctx.styleBundleCount).toBe(1);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(false);
      });
    });
  });

  it('should do a re-transpile, re-bundle module and re-bundle styles if component file change', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] } ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'sass-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/sass-a.scss', `body { color: red; }`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(1);
      expect(ctx.moduleBundleCount).toBe(1);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'sass-a.scss' }) export class CmpA { constructor() { 'file change'; } }`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');

      }).then((r: BuildResults) => {
        expect(r.diagnostics.length).toBe(0);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);
        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      });
    });
  });

  it('should not re-transpile or re-bundle module when only a sass change', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] } ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);

    return build(config, ctx).then(() => {

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-a.scss', `body { color: blue; }`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.scss');

      }).then((r: BuildResults) => {
        expect(ctx.transpileBuildCount).toBe(0);
        expect(ctx.moduleBundleCount).toBe(0);
        expect(ctx.sassBuildCount).toBe(1);
        expect(ctx.styleBundleCount).toBe(1);

        expect(r.files.length).toBe(1);
        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      });
    });
  });

  it('should not resave unchanged content', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] } ];
    config.watch = true;
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);

    return build(config, ctx).then(() => {

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.scss');

      }).then((r: BuildResults) => {
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);
        expect(ctx.sassBuildCount).toBe(1);
        expect(ctx.styleBundleCount).toBe(1);

        expect(r.files.length).toBe(0);
      });
    });
  });


  var registry: ComponentRegistry = {};
  var ctx: BuildContext = {};
  var config: BuildConfig = {};

  beforeEach(() => {
    ctx = null;
    registry = {};

    config = mockBuildConfig();
    config.sys.fs = mockFs();

    mkdirSync('/');
    mkdirSync('/src');
    writeFileSync('/src/index.html', `<cmp-a></cmp-a>`);
  });


  function mkdirSync(path: string) {
    (<any>config.sys.fs).mkdirSync(path);
  }

  function writeFileSync(filePath: string, data: any) {
    (<any>config.sys.fs).writeFileSync(filePath, data);
  }

  function unlinkSync(filePath: string) {
    (<any>config.sys.fs).unlinkSync(filePath);
  }

  function wroteFile(r: BuildResults, p: string) {
    const filename = path.basename(p);
    return r.files.some(f => {
      return path.basename(f) === filename;
    });
  }

});
