import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import { COPY, DIST_CUSTOM_ELEMENTS, DIST_TYPES, join } from '@utils';
import path from 'path';
import { validateConfig } from '../validate-config';
describe('validate-output-dist-custom-element', () => {
    describe('validateCustomElement', () => {
        // use Node's resolve() here to simulate a user using either Win/Posix separators (depending on the platform these
        // tests are run on)
        const rootDir = path.resolve('/');
        const defaultDistDir = join(rootDir, 'dist', 'components');
        const distCustomElementsDir = 'my-dist-custom-elements';
        let userConfig;
        beforeEach(() => {
            userConfig = mockConfig();
        });
        it('generates a default dist-custom-elements output target', () => {
            const outputTarget = {
                type: DIST_CUSTOM_ELEMENTS,
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets).toEqual([
                {
                    type: DIST_TYPES,
                    dir: defaultDistDir,
                    typesDir: join(rootDir, 'dist', 'types'),
                },
                {
                    type: DIST_CUSTOM_ELEMENTS,
                    copy: [],
                    dir: defaultDistDir,
                    empty: true,
                    externalRuntime: true,
                    generateTypeDeclarations: true,
                    customElementsExportBehavior: 'default',
                },
            ]);
        });
        it('uses a provided export behavior over the default value', () => {
            const outputTarget = {
                type: DIST_CUSTOM_ELEMENTS,
                customElementsExportBehavior: 'single-export-module',
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets).toEqual([
                {
                    type: DIST_TYPES,
                    dir: defaultDistDir,
                    typesDir: join(rootDir, 'dist', 'types'),
                },
                {
                    type: DIST_CUSTOM_ELEMENTS,
                    copy: [],
                    dir: defaultDistDir,
                    empty: true,
                    externalRuntime: true,
                    generateTypeDeclarations: true,
                    customElementsExportBehavior: 'single-export-module',
                },
            ]);
        });
        it('uses the default export behavior if the specified value is invalid', () => {
            const outputTarget = {
                type: DIST_CUSTOM_ELEMENTS,
                customElementsExportBehavior: 'not-a-valid-option',
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets).toEqual([
                {
                    type: DIST_TYPES,
                    dir: defaultDistDir,
                    typesDir: join(rootDir, 'dist', 'types'),
                },
                {
                    type: DIST_CUSTOM_ELEMENTS,
                    copy: [],
                    dir: defaultDistDir,
                    empty: true,
                    externalRuntime: true,
                    generateTypeDeclarations: true,
                    customElementsExportBehavior: 'default',
                },
            ]);
        });
        it('uses a provided dir field over a default directory', () => {
            const outputTarget = {
                type: DIST_CUSTOM_ELEMENTS,
                dir: distCustomElementsDir,
                generateTypeDeclarations: false,
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets).toEqual([
                {
                    type: DIST_CUSTOM_ELEMENTS,
                    copy: [],
                    dir: join(rootDir, distCustomElementsDir),
                    empty: true,
                    externalRuntime: true,
                    generateTypeDeclarations: false,
                    customElementsExportBehavior: 'default',
                },
            ]);
        });
        describe('"empty" field', () => {
            it('defaults the "empty" field to true if not provided', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
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
                        empty: true,
                        externalRuntime: false,
                        generateTypeDeclarations: false,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('defaults the "empty" field to true it\'s not a boolean', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    empty: undefined,
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
                        empty: true,
                        externalRuntime: false,
                        generateTypeDeclarations: false,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
        });
        describe('"externalRuntime" field', () => {
            it('defaults the "externalRuntime" field to true if not provided', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    empty: false,
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
                        externalRuntime: true,
                        generateTypeDeclarations: false,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('defaults the "externalRuntime" field to true it\'s not a boolean', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    empty: false,
                    externalRuntime: undefined,
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
                        externalRuntime: true,
                        generateTypeDeclarations: false,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
        });
        describe('"generateTypeDeclarations" field', () => {
            it('defaults the "generateTypeDeclarations" field to true if not provided', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    empty: false,
                };
                userConfig.outputTargets = [outputTarget];
                const { config } = validateConfig(userConfig, mockLoadConfigInit());
                expect(config.outputTargets).toEqual([
                    {
                        type: DIST_TYPES,
                        dir: defaultDistDir,
                        typesDir: join(rootDir, 'dist', 'types'),
                    },
                    {
                        type: DIST_CUSTOM_ELEMENTS,
                        copy: [],
                        dir: defaultDistDir,
                        empty: false,
                        externalRuntime: true,
                        generateTypeDeclarations: true,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('defaults the "generateTypeDeclarations" field to true it\'s not a boolean', () => {
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    empty: false,
                    generateTypeDeclarations: undefined,
                };
                userConfig.outputTargets = [outputTarget];
                const { config } = validateConfig(userConfig, mockLoadConfigInit());
                expect(config.outputTargets).toEqual([
                    {
                        type: DIST_TYPES,
                        dir: defaultDistDir,
                        typesDir: join(rootDir, 'dist', 'types'),
                    },
                    {
                        type: DIST_CUSTOM_ELEMENTS,
                        copy: [],
                        dir: defaultDistDir,
                        empty: false,
                        externalRuntime: true,
                        generateTypeDeclarations: true,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('creates a types directory when "generateTypeDeclarations" is true', () => {
                const outputTarget = {
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
                        typesDir: join(rootDir, 'dist', 'types'),
                    },
                    {
                        type: DIST_CUSTOM_ELEMENTS,
                        copy: [],
                        dir: defaultDistDir,
                        empty: false,
                        externalRuntime: false,
                        generateTypeDeclarations: true,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('creates a types directory for a custom directory', () => {
                const outputTarget = {
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
                        dir: join(rootDir, distCustomElementsDir),
                        typesDir: join(rootDir, 'dist', 'types'),
                    },
                    {
                        type: DIST_CUSTOM_ELEMENTS,
                        copy: [],
                        dir: join(rootDir, distCustomElementsDir),
                        empty: false,
                        externalRuntime: false,
                        generateTypeDeclarations: true,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
            it('doesn\'t create a types directory when "generateTypeDeclarations" is false', () => {
                const outputTarget = {
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
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
        });
        describe('copy tasks', () => {
            it('copies existing copy tasks over to the output target', () => {
                const copyOutputTarget = {
                    src: 'mock/src',
                    dest: 'mock/dest',
                };
                const copyOutputTarget2 = {
                    src: 'mock/src2',
                    dest: 'mock/dest2',
                };
                const outputTarget = {
                    type: DIST_CUSTOM_ELEMENTS,
                    copy: [copyOutputTarget, copyOutputTarget2],
                    dir: distCustomElementsDir,
                    empty: false,
                    externalRuntime: false,
                    generateTypeDeclarations: false,
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
                        dir: join(rootDir, distCustomElementsDir),
                        empty: false,
                        externalRuntime: false,
                        generateTypeDeclarations: false,
                        customElementsExportBehavior: 'default',
                    },
                ]);
            });
        });
    });
});
//# sourceMappingURL=validate-output-dist-custom-element.spec.js.map