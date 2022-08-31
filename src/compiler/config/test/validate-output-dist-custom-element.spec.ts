import type * as d from '@stencil/core/declarations';
import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import { COPY, DIST_CUSTOM_ELEMENTS, DIST_TYPES } from '../../output-targets/output-utils';
import { validateConfig } from '../validate-config';
import path from 'path';

describe('validate-output-dist-custom-element', () => {
  describe('validateCustomElement', () => {
    const rootDir = path.resolve('/');
    const defaultDistDir = path.join(rootDir, 'dist', 'components');
    const distCustomElementsDir = 'my-dist-custom-elements';
    let userConfig: d.Config;

    beforeEach(() => {
      userConfig = mockConfig();
    });

    it('generates a default dist-custom-elements output target', () => {
      const outputTarget: d.OutputTargetDistCustomElements = {
        type: DIST_CUSTOM_ELEMENTS,
      };
      userConfig.outputTargets = [outputTarget];

      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.outputTargets).toEqual([
        {
          type: DIST_CUSTOM_ELEMENTS,
          copy: [],
          dir: defaultDistDir,
          empty: true,
          externalRuntime: true,
        },
      ]);
    });

    it('uses a provided dir field over a default directory', () => {
      const outputTarget: d.OutputTargetDistCustomElements = {
        type: DIST_CUSTOM_ELEMENTS,
        dir: distCustomElementsDir,
      };
      userConfig.outputTargets = [outputTarget];

      const { config } = validateConfig(userConfig, mockLoadConfigInit());
      expect(config.outputTargets).toEqual([
        {
          type: DIST_CUSTOM_ELEMENTS,
          copy: [],
          dir: path.join(rootDir, distCustomElementsDir),
          empty: true,
          externalRuntime: true,
        },
      ]);
    });

    describe('"empty" field', () => {
      it('defaults the "empty" field to true if not provided', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          externalRuntime: false,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: true,
            externalRuntime: false,
          },
        ]);
      });

      it('defaults the "empty" field to true it\'s not a boolean', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          empty: undefined,
          externalRuntime: false,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: true,
            externalRuntime: false,
          },
        ]);
      });
    });

    describe('"externalRuntime" field', () => {
      it('defaults the "externalRuntime" field to true if not provided', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          empty: false,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: false,
            externalRuntime: true,
          },
        ]);
      });

      it('defaults the "externalRuntime" field to true it\'s not a boolean', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          empty: false,
          externalRuntime: undefined,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: false,
            externalRuntime: true,
          },
        ]);
      });
    });

    describe('"generateTypeDeclarations" field', () => {
      it('creates a types directory when "generateTypeDeclarations" is true', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          empty: false,
          externalRuntime: false,
          generateTypeDeclarations: true,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_TYPES,
            dir: defaultDistDir,
            typesDir: path.join(rootDir, 'dist', 'types'),
          },
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: false,
            externalRuntime: false,
            generateTypeDeclarations: true,
          },
        ]);
      });

      it('creates a types directory for a custom directory', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          dir: distCustomElementsDir,
          empty: false,
          externalRuntime: false,
          generateTypeDeclarations: true,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_TYPES,
            dir: path.join(rootDir, distCustomElementsDir),
            typesDir: path.join(rootDir, 'dist', 'types'),
          },
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: path.join(rootDir, distCustomElementsDir),
            empty: false,
            externalRuntime: false,
            generateTypeDeclarations: true,
          },
        ]);
      });

      it('doesn\'t create a types directory when "generateTypeDeclarations" is false', () => {
        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          empty: false,
          externalRuntime: false,
          generateTypeDeclarations: false,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [],
            dir: defaultDistDir,
            empty: false,
            externalRuntime: false,
            generateTypeDeclarations: false,
          },
        ]);
      });
    });

    describe('copy tasks', () => {
      it('copies existing copy tasks over to the output target', () => {
        const copyOutputTarget: d.CopyTask = {
          src: 'mock/src',
          dest: 'mock/dest',
        };
        const copyOutputTarget2: d.CopyTask = {
          src: 'mock/src2',
          dest: 'mock/dest2',
        };

        const outputTarget: d.OutputTargetDistCustomElements = {
          type: DIST_CUSTOM_ELEMENTS,
          copy: [copyOutputTarget, copyOutputTarget2],
          dir: distCustomElementsDir,
          empty: false,
          externalRuntime: false,
        };
        userConfig.outputTargets = [outputTarget];

        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
          {
            type: COPY,
            dir: rootDir,
            copy: [copyOutputTarget, copyOutputTarget2],
          },
          {
            type: DIST_CUSTOM_ELEMENTS,
            copy: [copyOutputTarget, copyOutputTarget2],
            dir: path.join(rootDir, distCustomElementsDir),
            empty: false,
            externalRuntime: false,
          },
        ]);
      });
    });
  });
});
