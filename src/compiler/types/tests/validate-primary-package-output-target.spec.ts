import { mockBuildCtx, mockCompilerCtx, mockValidatedConfig } from '@stencil/core/testing';

import type * as d from '../../../declarations';
import {
  PRIMARY_PACKAGE_TARGET_CONFIGS,
  PrimaryPackageOutputTargetRecommendedConfig,
  validateModulePath,
  validatePrimaryPackageOutputTarget,
  validateTypesPath,
} from '../validate-primary-package-output-target';

describe('validatePrimaryPackageOutputTarget', () => {
  let config: d.ValidatedConfig;
  let compilerCtx: d.CompilerCtx;
  let buildCtx: d.BuildCtx;

  beforeEach(() => {
    config = mockValidatedConfig({
      validatePrimaryPackageOutputTarget: true,
      outputTargets: [
        {
          type: 'dist',
          isPrimaryPackageOutputTarget: true,
          dir: '/dist',
          typesDir: '/dist/types',
        },
      ],
    });

    compilerCtx = mockCompilerCtx(config);
    compilerCtx.fs.accessSync = () => true;

    buildCtx = mockBuildCtx(config, compilerCtx);
    buildCtx.packageJson.module = 'dist/index.js';
    buildCtx.packageJson.types = 'dist/types/index.d.ts';
  });

  describe('check basic Stencil config scenarios', () => {
    it('should log a warning if `validatePrimaryPackageOutputTarget` if `false` but primary targets are set', () => {
      config.validatePrimaryPackageOutputTarget = false;

      validatePrimaryPackageOutputTarget(config, compilerCtx, buildCtx);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        'Your Stencil project has designated a primary package output target without enabling primary package validation for your project. Either set `validatePrimaryPackageOutputTarget: true` in your Stencil config or remove `isPrimaryPackageOutputTarget: true` from all output targets.'
      );
    });

    it('should log a warning if any non-eligible targets were marked as `isPrimaryPackageOutputTarget`', () => {
      config.outputTargets = [
        {
          type: 'copy',
          isPrimaryPackageOutputTarget: true,
        },
      ] as any[];

      validatePrimaryPackageOutputTarget(config, compilerCtx, buildCtx);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `Your Stencil project has assigned one or more un-validated output targets as the primary package output target. No validation will take place. Please remove the 'isPrimaryPackageOutputTarget' flag from the following output targets in your Stencil config: copy`
      );
    });

    it('should log a warning if no eligible targets were marked as `isPrimaryPackageOutputTarget`', () => {
      config.outputTargets = [
        {
          type: 'dist',
        },
      ];

      validatePrimaryPackageOutputTarget(config, compilerCtx, buildCtx);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `Your Stencil project has not assigned a primary package output target. Stencil recommends that you assign a primary output target so it can validate values for fields in your project's 'package.json'`
      );
    });

    it('should log a warning if multiple targets were marked as `isPrimaryPackageOutputTarget`', () => {
      config.outputTargets = [
        ...config.outputTargets,
        {
          type: 'dist-custom-elements',
          isPrimaryPackageOutputTarget: true,
        },
      ];

      validatePrimaryPackageOutputTarget(config, compilerCtx, buildCtx);

      console.log('DIAG', buildCtx.diagnostics);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `Your Stencil config has multiple output targets with 'isPrimaryPackageOutputTarget: true'. Stencil does not support validating 'package.json' fields for multiple output targets. Please updated your Stencil config to only assign one primary package output target. For now, Stencil will use the first primary target it finds.`
      );
    });
  });

  // TODO(NOW): do for each target type
  describe('validateModulePath', () => {
    let targetToValidate: d.PrimaryPackageOutputTarget;
    let recommendedOutputTargetConfig: PrimaryPackageOutputTargetRecommendedConfig;

    beforeEach(() => {
      targetToValidate = {
        type: 'dist',
        dir: '/dist',
      };
      recommendedOutputTargetConfig = PRIMARY_PACKAGE_TARGET_CONFIGS[targetToValidate.type];
    });

    it('should log a warning if no module path is provided', () => {
      delete buildCtx.packageJson.module;

      validateModulePath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ./dist/index.js`
      );
    });

    it('should log a warning if the set module path does not match the recommended path', () => {
      buildCtx.packageJson.module = '/dist/tmp/index.js';

      validateModulePath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "module" property is set to "/dist/tmp/index.js". It's recommended to set the "module" property to: ./dist/index.js`
      );
    });

    it('should not log a warning if the recommended path is used', () => {
      validateModulePath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(0);
    });
  });

  // TODO(NOW): do for each target type
  describe('validateTypesPath', () => {
    let targetToValidate: d.PrimaryPackageOutputTarget;
    let recommendedOutputTargetConfig: PrimaryPackageOutputTargetRecommendedConfig;

    beforeEach(() => {
      targetToValidate = {
        type: 'dist-types',
        dir: '/dist/types',
        typesDir: '/dist/types',
      };
      recommendedOutputTargetConfig = PRIMARY_PACKAGE_TARGET_CONFIGS[targetToValidate.type];
    });

    it('should log a warning if no types path is provided', () => {
      delete buildCtx.packageJson.types;

      validateTypesPath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "types" property is required when generating a distribution. It's recommended to set the "types" property to: ./dist/types/index.d.ts`
      );
    });

    it('should log a warning if the types path does not have a ".d.ts" extension', () => {
      buildCtx.packageJson.types = '/dist/types/index.ts';

      validateTypesPath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "types" file must have a ".d.ts" extension: /dist/types/index.ts`
      );
    });

    it('should log a warning if the set types path does not match the recommended path', () => {
      buildCtx.packageJson.types = '/dist/tmp/index.d.ts';

      validateTypesPath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('warn');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "types" property is set to "/dist/tmp/index.d.ts". It's recommended to set the "types" property to: ./dist/types/index.d.ts`
      );
    });

    it('should log a error if the types file cannot be accessed', () => {
      compilerCtx.fs.accessSync = () => false;

      validateTypesPath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(1);
      expect(buildCtx.diagnostics[0].level).toEqual('error');
      expect(buildCtx.diagnostics[0].messageText).toEqual(
        `package.json "types" property is set to "dist/types/index.d.ts" but cannot be found.`
      );
    });

    it('should not log anything if the recommended path is used and accessible', () => {
      validateTypesPath(config, compilerCtx, buildCtx, recommendedOutputTargetConfig, targetToValidate);

      expect(buildCtx.diagnostics.length).toBe(0);
    });
  });
});
