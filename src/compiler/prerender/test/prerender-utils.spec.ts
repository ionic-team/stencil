import * as path from 'path';
import * as d from '../../../declarations';
import { getWritePathFromUrl, isValidCrawlableAnchor } from '../prerender-utils';
import { TestingConfig } from '../../../testing/testing-config';
import { validateConfig } from '../../config/validate-config';
import { normalizePath } from '../../util';


describe('isValidCrawlableAnchor', () => {

  const root = path.resolve('/');

  it('true for non _self target attr', () => {
    const r = isValidCrawlableAnchor({
      href: '/',
      target: '_blank'
    });
    expect(r).toBe(false);
  });

  it('true for _SELF target attr', () => {
    const r = isValidCrawlableAnchor({
      href: '/',
      target: '_SELF'
    });
    expect(r).toBe(true);
  });

  it('true for _self target attr', () => {
    const r = isValidCrawlableAnchor({
      href: '/',
      target: '_self'
    });
    expect(r).toBe(true);
  });

  it('true for valid href attr', () => {
    const r = isValidCrawlableAnchor({
      href: '/'
    });
    expect(r).toBe(true);
  });

  it('false for # href attr', () => {
    const r = isValidCrawlableAnchor({
      href: '#'
    });
    expect(r).toBe(false);
  });

  it('false for spaces only href attr', () => {
    const r = isValidCrawlableAnchor({
      href: '    '
    });
    expect(r).toBe(false);
  });

  it('false for empty href attr', () => {
    const r = isValidCrawlableAnchor({
      href: ''
    });
    expect(r).toBe(false);
  });

  it('false for no href attr', () => {
    const r = isValidCrawlableAnchor({});
    expect(r).toBe(false);
  });

  it('false for invalid anchor', () => {
    const r = isValidCrawlableAnchor(null);
    expect(r).toBe(false);
  });

});


describe('getWritePathFromUrl', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;
  const root = path.resolve('/');

  it('custom www dir with sub directories', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: path.join('some', 'crazy', 'path')
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'some', 'crazy', 'path', 'index.html')));
  });

  it('custom www dir', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'somepath'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/docs/about/#safetydance';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'somepath', 'docs', 'about', 'index.html')));
  });

  it('custom baseUrl, trailing slash', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-dir',
        baseUrl: '/base-url'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/base-url/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'custom-dir', 'index.html')));
  });

  it('custom baseUrl, no trailing slash', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-dir',
        baseUrl: '/base-url'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/base-url';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'custom-dir', 'index.html')));
  });

  it('defaults, ignore hash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/docs/about/#safetydance';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'www', 'docs', 'about', 'index.html')));
  });

  it('defaults, ignore querystring', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/docs/about?tainted=love';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'www', 'docs', 'about', 'index.html')));
  });

  it('defaults, sub dir with trailing slash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/docs/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'www', 'docs', 'index.html')));
  });

  it('defaults, sub dir no trailing slash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/docs';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'www', 'docs', 'index.html')));
  });

  it('defaults, root dir', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets.find(o => o.type === 'www') as d.OutputTargetWww;
    const url = 'http://stenciljs.com/';
    const p = getWritePathFromUrl(config, outputTarget, url);
    expect(p).toBe(normalizePath(path.join(root, 'www', 'index.html')));
  });

});
