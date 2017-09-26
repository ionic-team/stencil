import { build } from '../build';
import { BuildConfig, BuildContext, BuildResults, ComponentRegistry } from '../../../util/interfaces';
import { mockBuildConfig } from '../../../testing/mocks';
import { parseComponentRegistry } from '../../../util/data-parse';
import { validateBuildConfig } from '../validation';


describe('build', () => {

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

        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
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

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
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

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
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
    writeFileSync('/src/cmp-a.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);
    writeFileSync('/src/cmp-b.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB {}`);
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
      expect(wroteFile(r, 'cmp-a.css')).toBe(true);
      expect(wroteFile(r, 'cmp-b.css')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        ctx.watcher.$triggerEvent('change', '/src/service.tsx');

      }).then((r: BuildResults) => {
        expect(ctx.isChangeBuild).toBe(true);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(2);
        expect(ctx.sassBuildCount).toBe(0);
        expect(ctx.styleBundleCount).toBe(0);

        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-b.js')).toBe(true);
        expect(wroteFile(r, 'cmp-a.css')).toBe(false);
        expect(wroteFile(r, 'cmp-b.css')).toBe(false);
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
    writeFileSync('/src/cmp-a.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-a' }) export class CmpA {}`);
    writeFileSync('/src/cmp-b.tsx', `import { MyService } from './service'; @Component({ tag: 'cmp-b' }) export class CmpB {}`);
    writeFileSync('/src/service.tsx', `export class MyService {}`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(3);
      expect(ctx.moduleBundleCount).toBe(2);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/service.tsx', `export class MyService { constructor(){} }`);
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

        expect(wroteFile(r, 'cmp-a.js')).toBe(false);
        expect(wroteFile(r, 'cmp-a.css')).toBe(true);

        expect(wroteFile(r, 'cmp-b.js')).toBe(false);
        expect(wroteFile(r, 'cmp-b.css')).toBe(true);
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
      expect(wroteFile(r, 'cmp-a.css')).toBe(true);
      expect(wroteFile(r, 'cmp-b.js')).toBe(true);
      expect(wroteFile(r, 'cmp-b.css')).toBe(true);

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
        expect(wroteFile(r, 'cmp-a.css')).toBe(true);

        expect(wroteFile(r, 'cmp-b.js')).toBe(false);
        expect(wroteFile(r, 'cmp-b.css')).toBe(false);
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
      expect(wroteFile(r, 'cmp-a.css')).toBe(true);

      return new Promise(resolve => {
        ctx.onFinish = resolve;
        writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'sass-a.scss' }) export class CmpA { constructor() { 'file change'; } }`);
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.tsx');

      }).then((r: BuildResults) => {
        expect(r.diagnostics.length).toBe(0);
        expect(ctx.transpileBuildCount).toBe(1);
        expect(ctx.moduleBundleCount).toBe(1);
        expect(wroteFile(r, 'cmp-a.js')).toBe(true);
        expect(wroteFile(r, 'cmp-a.css')).toBe(true);
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
        ctx.watcher.$triggerEvent('change', '/src/cmp-a.scss');

      }).then((r: BuildResults) => {
        expect(ctx.transpileBuildCount).toBe(0);
        expect(ctx.moduleBundleCount).toBe(0);
        expect(ctx.sassBuildCount).toBe(1);
        expect(ctx.styleBundleCount).toBe(1);

        expect(wroteFile(r, 'cmp-a.js')).toBe(false);
        expect(wroteFile(r, 'cmp-a.css')).toBe(true);
      });
    });
  });

  it('should build one component w/ styleUrl', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] } ];
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`);
    writeFileSync('/src/cmp-a.scss', `body { color: red; }`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(r.manifest.components.length).toBe(1);
      expect(ctx.transpileBuildCount).toBe(1);
      expect(ctx.sassBuildCount).toBe(1);
      expect(ctx.moduleBundleCount).toBe(1);
      expect(ctx.styleBundleCount).toBe(1);

      expect(wroteFile(r, 'cmp-a.js')).toBe(true);
      expect(wroteFile(r, 'cmp-a.css')).toBe(true);

      const cmpMeta = r.manifest.components.find(c => c.tag === 'cmp-a');
      expect(cmpMeta.styles.$.stylePaths[0]).toEqual('cmp-a.scss');
    });
  });

  it('should build one component w/ no styles', () => {
    ctx = {};
    config.bundles = [ { components: ['cmp-a'] } ];
    writeFileSync('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);

    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(r.manifest.components.length).toBe(1);
      expect(ctx.transpileBuildCount).toBe(1);
      expect(ctx.sassBuildCount).toBe(0);
      expect(ctx.moduleBundleCount).toBe(1);
      expect(ctx.styleBundleCount).toBe(0);

      const cmpMeta = r.manifest.components.find(c => c.tag === 'cmp-a');
      expect(cmpMeta).toBeDefined();
    });
  });

  it('should build no components', () => {
    ctx = {};
    return build(config, ctx).then(r => {
      expect(r.diagnostics.length).toBe(0);
      expect(r.manifest.components.length).toBe(0);
      expect(ctx.transpileBuildCount).toBe(0);
      expect(ctx.sassBuildCount).toBe(0);
      expect(ctx.moduleBundleCount).toBe(0);
      expect(ctx.styleBundleCount).toBe(0);
    });
  });

  it('should ignore common web files not used in builds', () => {
    validateBuildConfig(config);
    const reg = config.watchIgnoredRegex;

    expect(reg.test('/asdf/.gitignore')).toBe(true);
    expect(reg.test('/.gitignore')).toBe(true);
    expect(reg.test('.gitignore')).toBe(true);
    expect(reg.test('/image.jpg')).toBe(true);
    expect(reg.test('image.jpg')).toBe(true);
    expect(reg.test('/asdf/image.jpg')).toBe(true);
    expect(reg.test('/asdf/image.jpeg')).toBe(true);
    expect(reg.test('/asdf/image.png')).toBe(true);
    expect(reg.test('/asdf/image.gif')).toBe(true);
    expect(reg.test('/asdf/image.woff')).toBe(true);
    expect(reg.test('/asdf/image.woff2')).toBe(true);
    expect(reg.test('/asdf/image.ttf')).toBe(true);
    expect(reg.test('/asdf/image.eot')).toBe(true);

    expect(reg.test('/asdf/image.ts')).toBe(false);
    expect(reg.test('/asdf/image.tsx')).toBe(false);
    expect(reg.test('/asdf/image.css')).toBe(false);
    expect(reg.test('/asdf/image.scss')).toBe(false);
    expect(reg.test('/asdf/image.sass')).toBe(false);
    expect(reg.test('/asdf/image.html')).toBe(false);
    expect(reg.test('/asdf/image.htm')).toBe(false);
  });


  // var logger = mockLogger();
  // var chalk = require('chalk');
  // logger = new CommandLineLogger({
  //   level: 'debug',
  //   process: process,
  //   chalk: chalk
  // });
  var registry: ComponentRegistry = {};
  var ctx: BuildContext = {};
  var config: BuildConfig = {};

  beforeEach(() => {
    ctx = null;
    registry = {};

    config = mockBuildConfig();

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

  function wroteFile(r: BuildResults, path: string) {
    return r.files.some(f => {
      return f.indexOf(path) > -1;
    });
  }

});
