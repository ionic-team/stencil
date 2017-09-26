import { BuildConfig } from '../../../util/interfaces';
import { CORE_NAME } from '../../../util/constants';
import { generatePreamble } from '../../util';
import { mockStencilSystem } from '../../../testing/mocks';

import * as core from '../app-core';

describe('app-core', () => {
  let config: BuildConfig;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem()
    };
  });

  describe('generateCore', () => {
    let mockGetClientCoreFile: jest.Mock<Promise<string>>;
    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects/Ionic/Stencil';
      mockGetClientCoreFile = jest.fn();
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(''));
      config.sys.getClientCoreFile = mockGetClientCoreFile;
    });

    it('uses the core file name', () => {
      core.generateCore(config, ['']);
      expect(mockGetClientCoreFile.mock.calls.length).toEqual(1);
      expect(mockGetClientCoreFile.mock.calls[0][0]).toEqual({ staticName: `${CORE_NAME}.js` });
    });

    it('uses the core dev file name', () => {
      config.devMode = true;
      core.generateCore(config, ['']);
      expect(mockGetClientCoreFile.mock.calls.length).toEqual(1);
      expect(mockGetClientCoreFile.mock.calls[0][0]).toEqual({ staticName: `${CORE_NAME}.dev.js` });
    });

    it('genertes the full wrapped content', async () => {
      const preamble = generatePreamble(config).trim();
      mockGetClientCoreFile.mockReturnValue(Promise.resolve('I am core'));
      const res = await core.generateCore(config, ['global line 1', 'global line 2']);
      const lines = res.split('\n');
      expect(lines[0]).toEqual(preamble);
      expect(lines[1]).toEqual(`(function(Context,appNamespace,publicPath){"use strict";`);
      expect(lines[3]).toEqual('global line 1');
      expect(lines[4]).toEqual('global line 2');
      expect(lines[5]).toEqual('I am core');
      expect(lines[6]).toEqual(`})({},"${config.namespace}","Projects/Ionic/Stencil/willywendleswetwasabi/");`);
    });
  });

  describe('generateCoreES5WithPolyfills', () => {
    let mockGetClientCoreFile: jest.Mock<Promise<string>>;
    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects/Ionic/Stencil';
      mockGetClientCoreFile = jest.fn();
      mockGetClientCoreFile.mockReturnValue(Promise.resolve(''));
      config.sys.getClientCoreFile = mockGetClientCoreFile;
    });

    it('includes the required polyfills', () => {
      core.generateCoreES5WithPolyfills(config, ['']);
      expect(mockGetClientCoreFile.mock.calls.length).toEqual(8);
      expect(mockGetClientCoreFile.mock.calls[0][0]).toEqual({ staticName: 'polyfills/document-register-element.js' });
      expect(mockGetClientCoreFile.mock.calls[1][0]).toEqual({ staticName: 'polyfills/object-assign.js' });
      expect(mockGetClientCoreFile.mock.calls[2][0]).toEqual({ staticName: 'polyfills/promise.js' });
      expect(mockGetClientCoreFile.mock.calls[3][0]).toEqual({ staticName: 'polyfills/fetch.js' });
      expect(mockGetClientCoreFile.mock.calls[4][0]).toEqual({ staticName: 'polyfills/request-animation-frame.js' });
      expect(mockGetClientCoreFile.mock.calls[5][0]).toEqual({ staticName: 'polyfills/closest.js' });
      expect(mockGetClientCoreFile.mock.calls[6][0]).toEqual({ staticName: 'polyfills/performance-now.js' });
    });

    it('uses the core file name', () => {
      core.generateCoreES5WithPolyfills(config, ['']);
      const lastCall = mockGetClientCoreFile.mock.calls.length - 1;
      expect(mockGetClientCoreFile.mock.calls[lastCall][0]).toEqual({ staticName: `${CORE_NAME}.es5.js` });
    });

    it('uses the core dev file name', () => {
      config.devMode = true;
      core.generateCoreES5WithPolyfills(config, ['']);
      const lastCall = mockGetClientCoreFile.mock.calls.length - 1;
      expect(mockGetClientCoreFile.mock.calls[lastCall][0]).toEqual({ staticName: `${CORE_NAME}.es5.dev.js` });
    });

    it('genertes the full wrapped content', async () => {
      const preamble = generatePreamble(config).trim();
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am document register element'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am object assign'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am promise'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am fetch'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am raf'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am closest'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am performance now'));
      mockGetClientCoreFile.mockReturnValueOnce(Promise.resolve('I am core'));
      const res = await core.generateCoreES5WithPolyfills(config, ['global line 1', 'global line 2']);
      const lines = res.split('\n');
      expect(lines[0]).toEqual('I am document register element');
      expect(lines[1]).toEqual('I am object assign');
      expect(lines[2]).toEqual('I am promise');
      expect(lines[3]).toEqual('I am fetch');
      expect(lines[4]).toEqual('I am raf');
      expect(lines[5]).toEqual('I am closest');
      expect(lines[6]).toEqual('I am performance now');
      expect(lines[7]).toEqual(preamble);
      expect(lines[8]).toEqual(`(function(Context,appNamespace,publicPath){"use strict";`);
      expect(lines[10]).toEqual('global line 1');
      expect(lines[11]).toEqual('global line 2');
      expect(lines[12]).toEqual('I am core');
      expect(lines[13]).toEqual(`})({},"${config.namespace}","Projects/Ionic/Stencil/willywendleswetwasabi/");`);
    });
  });

  describe('getAppFileName', () => {
    it('returns the lower-cased namespace', () => {
      config.namespace = 'BarnAcleBobSBigBoaTs';
      expect(core.getAppFileName(config)).toEqual('barnaclebobsbigboats');
    });
  });

  describe('getAppPublicPath', () => {
    it('concatinates public path and namespace', () => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects/Ionic/Stencil';
      expect(core.getAppPublicPath(config)).toEqual('Projects/Ionic/Stencil/willywendleswetwasabi/');
    });

    it('handles windows paths', () => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects\\Ionic\\Stencil';
      expect(core.getAppPublicPath(config)).toEqual('Projects/Ionic/Stencil/willywendleswetwasabi/');
    });
  });

  describe('wrapCoreJs', () => {
    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects\\Ionic\\Stencil';
    });

    it('starts with the preamble', () => {
      const preamble = generatePreamble(config).trim();
      const lines = core.wrapCoreJs(config, '').split('\n');
      expect(lines[0]).toEqual(preamble);
    });

    it('wraps the JS content in an IFEE', () => {
      const lines = core.wrapCoreJs(config, 'this is JavaScript code, really it is').split('\n');
      expect(lines[1]).toEqual(`(function(Context,appNamespace,publicPath){"use strict";`);
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
      expect(lines[4]).toEqual(`})({},"${config.namespace}","Projects/Ionic/Stencil/willywendleswetwasabi/");`);
    });

    it('trims the JS content', () => {
      const lines = core.wrapCoreJs(config, '  this is JavaScript code, really it is     ').split('\n');
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
    });
  });
});
