import * as d from '../../../declarations';
import { getLazyBuildConditionals } from '../dist-lazy/lazy-build-conditionals';
import { getCustomElementsBuildConditionals } from '../dist-custom-elements-bundle/custom-elements-build-conditionals';
import { mockConfig } from '@stencil/core/testing';
import { validateConfig } from '../../config/validate-config';

describe('build-conditionals', () => {
  let userConfig: d.Config;
  let cmps: d.ComponentCompilerMeta[];

  beforeEach(() => {
    userConfig = mockConfig();
    cmps = [];
  });

  describe('getCustomElementsBuildConditionals', () => {
    it('taskQueue async', () => {
      userConfig.taskQueue = 'async';
      const { config } = validateConfig(userConfig);
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('taskQueue immediate', () => {
      userConfig.taskQueue = 'immediate';
      const { config } = validateConfig(userConfig);
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue sync (deprecated), same as immediate', () => {
      userConfig.taskQueue = 'sync' as any;
      const { config } = validateConfig(userConfig);
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue congestionAsync', () => {
      userConfig.taskQueue = 'congestionAsync';
      const { config } = validateConfig(userConfig);
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });
    it('taskQueue defaults', () => {
      const { config } = validateConfig(userConfig);
      const bc = getCustomElementsBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });
  });

  describe('getLazyBuildConditionals', () => {
    it('taskQueue async', () => {
      userConfig.taskQueue = 'async';
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('async');
    });

    it('taskQueue immediate', () => {
      userConfig.taskQueue = 'immediate';
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue sync (deprecated), same as immediate', () => {
      userConfig.taskQueue = 'sync' as any;
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(false);
      expect(bc.taskQueue).toBe(false);
      expect(config.taskQueue).toBe('immediate');
    });

    it('taskQueue congestionAsync', () => {
      userConfig.taskQueue = 'congestionAsync';
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });
    it('taskQueue defaults', () => {
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.asyncQueue).toBe(true);
      expect(bc.taskQueue).toBe(true);
      expect(config.taskQueue).toBe('congestionAsync');
    });

    it('tagNameTransform default', () => {
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.transformTagName).toBe(false);
    });

    it('tagNameTransform true', () => {
      userConfig.extras = {tagNameTransform: true};
      const { config } = validateConfig(userConfig);
      const bc = getLazyBuildConditionals(config, cmps);
      expect(bc.transformTagName).toBe(true);
    });
  });
});
