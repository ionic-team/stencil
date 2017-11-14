import { BuildConfig, BuildContext } from '../../../util/interfaces';
import { CORE_NAME } from '../../../util/constants';
import { generatePreamble } from '../../util';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';

import * as core from '../app-core';
import { getAppFileName, getAppPublicPath } from '../app-file-naming';


describe('app-core', () => {
  let config: BuildConfig;
  let ctx: BuildContext;
  let logger = mockLogger();

  beforeEach(() => {
    config = {
      logger: logger,
      sys: mockStencilSystem()
    };
    ctx = {};
  });

  describe('getAppFileName', () => {
    it('returns the lower-cased namespace', () => {
      config.namespace = 'BarnAcleBobSBigBoaTs';
      expect(getAppFileName(config)).toEqual('barnaclebobsbigboats');
    });
  });

  describe('getAppPublicPath', () => {
    it('concatinates public path and namespace', () => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects/Ionic/Stencil';
      expect(getAppPublicPath(config)).toEqual('Projects/Ionic/Stencil/willywendleswetwasabi/');
    });

    it('handles windows paths', () => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects\\Ionic\\Stencil';
      expect(getAppPublicPath(config)).toEqual('Projects/Ionic/Stencil/willywendleswetwasabi/');
    });
  });

  describe('wrapCoreJs', () => {
    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.publicPath = 'Projects\\Ionic\\Stencil';
    });

    it('starts with the preamble', () => {
      const preamble = generatePreamble(config).trim();
      const lines = core.wrapCoreJs(config, 'es2015', '').split('\n');
      expect(lines[0]).toEqual(preamble);
    });

    it('wraps the JS content in an IFEE', () => {
      const lines = core.wrapCoreJs(config, 'es2015', 'this is JavaScript code, really it is').split('\n');
      expect(lines[1]).toEqual(`(function(Context,appNamespace,hydratedCssClass,publicPath){"use strict";`);
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
      expect(lines[4]).toEqual(`})({},"${config.namespace}","${config.hydratedCssClass}","Projects/Ionic/Stencil/willywendleswetwasabi/");`);
    });

    it('trims the JS content', () => {
      const lines = core.wrapCoreJs(config, 'es2015', '  this is JavaScript code, really it is     ').split('\n');
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
    });
  });
});
