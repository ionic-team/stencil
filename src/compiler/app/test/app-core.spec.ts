import * as d from '../../../declarations';
import { generatePreamble } from '../../util';
import { mockConfig } from '../../../testing/mocks';
import * as core from '../app-core-browser';


describe('app-core', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;
  let cmpRegistry: d.ComponentRegistry;

  beforeEach(() => {
    config = mockConfig();
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
    cmpRegistry = {

    };
  });


  describe('wrapCoreJs', () => {

    beforeEach(() => {
      config.namespace = 'WillyWendLeSWeTWasaBi';
      config.fsNamespace = config.namespace.toLowerCase();
      outputTarget.resourcesUrl = 'Projects\\Ionic\\Stencil';
    });

    it('starts with the preamble', () => {
      const preamble = generatePreamble(config).trim();
      const lines = core.wrapCoreJs(config, '', cmpRegistry).split('\n');
      expect(lines[0]).toEqual(preamble);
    });

    it('wraps the JS content in an IFEE', () => {
      const lines = core.wrapCoreJs(config, 'this is JavaScript code, really it is', cmpRegistry).split('\n');
      expect(lines[1]).toEqual(`(function(window,document,Context,namespace,hydratedCssClass,components,resourcesUrl){"use strict";`);
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
      expect(lines[4]).toEqual(`})(window,document,{},"${config.namespace}","${config.hydratedCssClass}",[]);`);
    });

    it('trims the JS content', () => {
      const lines = core.wrapCoreJs(config, '  this is JavaScript code, really it is     ', cmpRegistry).split('\n');
      expect(lines[3]).toEqual('this is JavaScript code, really it is');
    });

  });

});
