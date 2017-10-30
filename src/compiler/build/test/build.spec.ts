import { build } from '../build';
import { BuildConfig, BuildContext, BuildResults, ComponentRegistry } from '../../../util/interfaces';
import { mockBuildConfig, mockFs } from '../../../testing/mocks';
import { parseComponentRegistry } from '../../../util/data-parse';
import { validateBuildConfig } from '../../../util/validate-config';
import * as path from 'path';


describe('build', () => {

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
