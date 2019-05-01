import * as d from '@stencil/core/declarations';
import { validateOutputTargetWww } from '../validate-outputs-www';
import { isOutputTargetWww } from '../../output-targets/output-utils';
import path from 'path';


describe('validateOutputTargetWww', () => {

  const rootDir = path.resolve('/');
  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: rootDir,
      flags: {}
    } as any;
  });

  it('should have default copy tasks', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs')
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.copy).toEqual([
      {'src': 'assets', 'warn': false},
      {'src': 'manifest.json', 'warn': false}
    ]);
  });

  it('should add copy tasks', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs'),
      copy: [{
        src: 'index-modules.html',
        dest: 'index-2.html'
      },
    ]
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.copy).toEqual([
      {
        src: 'index-modules.html',
        dest: 'index-2.html'
      },
      {'src': 'assets', 'warn': false},
      {'src': 'manifest.json', 'warn': false}
    ]);
  });

  it('should replace copy tasks', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs'),
      copy: [{
        src: 'assets',
        dest: 'assets2'
      },
    ]
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.copy).toEqual([
      {'src': 'assets', 'dest': 'assets2'},
      {'src': 'manifest.json', 'warn': false}
    ]);
  });

  it('should disable copy tasks', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs'),
      copy: null
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.copy).toEqual([]);
  });

  it('should www with sub directory', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs')
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.dir).toBe(path.join(rootDir, 'www', 'docs'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
  });

  it('should set www values', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: 'my-www',
      buildDir: 'my-build',
      indexHtml: 'my-index.htm',
      empty: false
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.type).toBe('www');
    expect(outputTarget.dir).toBe(path.join(rootDir, 'my-www'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'my-www', 'my-build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'my-www', 'my-index.htm'));
    expect(outputTarget.empty).toBe(false);
  });

  it('should default to add www when outputTargets is undefined', () => {
    validateOutputTargetWww(config);
    expect(config.outputTargets).toHaveLength(2);

    const outputTarget = config.outputTargets.find(isOutputTargetWww);
    expect(outputTarget.dir).toBe(path.join(rootDir, 'www'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'index.html'));
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add www when outputTargets exists, but without www', () => {
    config.outputTargets = [];
    validateOutputTargetWww(config);
    expect(config.outputTargets.some(isOutputTargetWww)).toBe(false);
  });

});
