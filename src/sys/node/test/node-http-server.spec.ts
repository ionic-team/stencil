import * as path from 'path';
import * as d from '../../../declarations';
import { getFilePath } from '../node-http-server';
import { TestingConfig } from '../../../testing/testing-config';
import { validateConfig } from '../../../compiler/config/validate-config';
import { normalizePath } from '@utils';


describe('node-http-server', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;
  const root = path.resolve('/');


  it('getFilePath w/ baseUrl and dir', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        baseUrl: '/some/web/url',
        dir: '/my/network/drive/some/file/system/dir'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const url = '/some/web/url/data.json?v=123#hello';

    const p = getFilePath(outputTarget, url);
    const normalizedPath = normalizePath(p);
    expect(normalizedPath).toBe('/my/network/drive/some/file/system/dir/data.json');
  });

  it('getFilePath w/ baseUrl', () => {
    config = new TestingConfig();
    config.outputTargets = [
      {
        type: 'www',
        baseUrl: '/docs'
      } as d.OutputTargetWww
    ];
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const url = '/docs/data.json?v=123#hello';

    const p = getFilePath(outputTarget, url);
    const normalizedPath = normalizePath(p);
    expect(normalizedPath).toBe(normalizePath(path.join(root, 'www', 'data.json')));
  });

  it('getFilePath, defaults w/ querystring and hash', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const url = '/data.json?v=123#hello';

    const p = getFilePath(outputTarget, url);
    const normalizedPath = normalizePath(p);
    expect(normalizedPath).toBe(normalizePath(path.join(root, 'www', 'data.json')));
  });

  it('getFilePath, defaults', () => {
    config = new TestingConfig();
    validateConfig(config);
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    const url = '/data.json';

    const p = getFilePath(outputTarget, url);
    const normalizedPath = normalizePath(p);
    expect(normalizedPath).toBe(normalizePath(path.join(root, 'www', 'data.json')));
  });

});
