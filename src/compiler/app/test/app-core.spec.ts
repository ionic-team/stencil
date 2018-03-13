import { CompilerCtx, Config, OutputTarget } from '../../../declarations';
import { generatePreamble } from '../../util';
import { mockConfig } from '../../../testing/mocks';
import * as core from '../app-core';


describe('app-core', () => {

  let config: Config;
  let outputTarget: OutputTarget;
  let ctx: CompilerCtx;

  beforeEach(() => {
    config = mockConfig();
    outputTarget = config.outputTargets[0];
    ctx = {};
  });


  describe('wrapCoreJs', () => {

    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.fsNamespace = config.namespace.toLowerCase();
      outputTarget.resourcePath = 'Projects\\Ionic\\Stencil';
    });

    it('starts with the preamble', () => {
      const preamble = generatePreamble(config).trim();
      const lines = core.wrapCoreJs(config, '').split('\n');
      expect(lines[0]).toEqual(preamble);
    });

    it('wraps the JS content in an IFEE', () => {
      const lines = core.wrapCoreJs(config, 'this is JavaScript code, really it is').split('\n');
      expect(lines[1]).toEqual(`(function(Context,namespace,hydratedCssClass,resourcePath,s){"use strict";`);
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
      expect(lines[4]).toEqual(`})({},"${config.namespace}","${config.hydratedCssClass}");`);
    });

    it('trims the JS content', () => {
      const lines = core.wrapCoreJs(config, '  this is JavaScript code, really it is     ').split('\n');
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
    });

  });

});
