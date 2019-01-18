import * as d from '@declarations';
import { BuildEvents } from '../../events';
import { mockBuildCtx, mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import { initFsWatch } from '../fs-watch-init';
import { validateConfig } from '../../../compiler/config/validate-config';


describe('watcher', () => {

  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let buildCtx: d.BuildCtx;

  beforeEach(() => {
    config = mockConfig();
    config.watch = true;
    compilerCtx = mockCompilerCtx();
    buildCtx = mockBuildCtx(config, compilerCtx);
    compilerCtx.events = new BuildEvents();
  });


  it('should only create the watch listener once', () => {
    let didCreateWatcher = initFsWatch(config, compilerCtx, buildCtx);
    expect(didCreateWatcher).toBe(true);

    didCreateWatcher = initFsWatch(config, compilerCtx, buildCtx);
    expect(didCreateWatcher).toBe(false);
  });

  it('should not create watcher if config.watch falsy', () => {
    config.watch = false;
    const didCreateWatcher = initFsWatch(config, compilerCtx, buildCtx);
    expect(didCreateWatcher).toBe(false);
  });

  it('should ignore common web files not used in builds', () => {
    validateConfig(config);
    const reg = config.watchIgnoredRegex;

    expect(reg.test('/asdf/.gitignore')).toBe(true);
    expect(reg.test('/.gitignore')).toBe(true);
    expect(reg.test('.gitignore')).toBe(true);
    expect(reg.test('/image.jpg')).toBe(false);
    expect(reg.test('image.jpg')).toBe(false);
    expect(reg.test('/asdf/image.jpg')).toBe(false);
    expect(reg.test('/asdf/image.jpeg')).toBe(false);
    expect(reg.test('/asdf/image.png')).toBe(false);
    expect(reg.test('/asdf/image.gif')).toBe(false);
    expect(reg.test('/asdf/image.woff')).toBe(false);
    expect(reg.test('/asdf/image.woff2')).toBe(false);
    expect(reg.test('/asdf/image.ttf')).toBe(false);
    expect(reg.test('/asdf/image.eot')).toBe(false);

    expect(reg.test('/asdf/image.ts')).toBe(false);
    expect(reg.test('/asdf/image.tsx')).toBe(false);
    expect(reg.test('/asdf/image.css')).toBe(false);
    expect(reg.test('/asdf/image.scss')).toBe(false);
    expect(reg.test('/asdf/image.sass')).toBe(false);
    expect(reg.test('/asdf/image.html')).toBe(false);
    expect(reg.test('/asdf/image.htm')).toBe(false);
  });

});
