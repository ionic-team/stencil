import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';

import type * as d from '../../../declarations';
import { validateConfig } from '../../config/validate-config';
import { getCustomElementsBuildConditionals } from '../dist-custom-elements/custom-elements-build-conditionals';
import { getLazyBuildConditionals } from '../dist-lazy/lazy-build-conditionals';

describe('build-conditionals', () => {
  let userConfig: d.Config;
  let cmps: d.ComponentCompilerMeta[];

  beforeEach(() => {
    userConfig = mockConfig();
    cmps = [];
  });

  describe('getCustomElementsBuildConditionals', () => {
    it('default', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc).toMatchObject({
        lazyLoad: false,
        hydrateClientSide: false,
        hydrateServerSide: false,
      });
    });

    it('taskQueue async', () => {
      userConfig.taskQueue = 'async';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('taskQueue immediate', () => {
      userConfig.taskQueue = 'immediate';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue congestionAsync', () => {
      userConfig.taskQueue = 'congestionAsync';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });

    it('taskQueue defaults', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('hydrateClientSide true', () => {
      const hydrateOutputTarget: d.OutputTargetHydrate = {
        type: 'dist-hydrate-script',
      };
      userConfig.outputTargets = [hydrateOutputTarget];
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.hydrateClientSide).toBe(true);
    });
  });

  describe('getLazyBuildConditionals', () => {
    it('default', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc).toMatchObject({
        lazyLoad: true,
        hydrateServerSide: false,
      });
    });

    it('taskQueue async', () => {
      userConfig.taskQueue = 'async';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('taskQueue immediate', () => {
      userConfig.taskQueue = 'immediate';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue congestionAsync', () => {
      userConfig.taskQueue = 'congestionAsync';
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });

    it('taskQueue defaults', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('tagNameTransform default', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.transformTagName).toBe(false);
    });

    it('tagNameTransform true', () => {
      userConfig.extras = { tagNameTransform: true };
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.transformTagName).toBe(true);
    });

    it('hydrateClientSide default', () => {
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.hydrateClientSide).toBe(false);
    });

    it('hydrateClientSide true', () => {
      const hydrateOutputTarget: d.OutputTargetHydrate = {
        type: 'dist-hydrate-script',
      };
      userConfig.outputTargets = [hydrateOutputTarget];
      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.hydrateClientSide).toBe(true);
    });
  });
});
