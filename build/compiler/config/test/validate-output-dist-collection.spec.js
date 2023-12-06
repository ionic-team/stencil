import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import { join, resolve } from '@utils';
import { validateConfig } from '../validate-config';
describe('validateDistCollectionOutputTarget', () => {
    let config;
    const rootDir = resolve('/');
    const defaultDir = join(rootDir, 'dist', 'collection');
    beforeEach(() => {
        config = mockConfig();
    });
    it('sets correct default values', () => {
        const target = {
            type: 'dist-collection',
            empty: false,
            dir: null,
            collectionDir: null,
        };
        config.outputTargets = [target];
        const { config: validatedConfig } = validateConfig(config, mockLoadConfigInit());
        expect(validatedConfig.outputTargets).toEqual([
            {
                type: 'dist-collection',
                empty: false,
                dir: defaultDir,
                collectionDir: null,
                transformAliasedImportPaths: true,
            },
        ]);
    });
    it('sets specified directory', () => {
        const target = {
            type: 'dist-collection',
            empty: false,
            dir: '/my-dist',
            collectionDir: null,
        };
        config.outputTargets = [target];
        const { config: validatedConfig } = validateConfig(config, mockLoadConfigInit());
        expect(validatedConfig.outputTargets).toEqual([
            {
                type: 'dist-collection',
                empty: false,
                dir: '/my-dist',
                collectionDir: null,
                transformAliasedImportPaths: true,
            },
        ]);
    });
    describe('transformAliasedImportPaths', () => {
        it.each([false, true])("sets option '%s' when explicitly '%s' in config", (transformAliasedImportPaths) => {
            const target = {
                type: 'dist-collection',
                empty: false,
                dir: null,
                collectionDir: null,
                transformAliasedImportPaths,
            };
            config.outputTargets = [target];
            const { config: validatedConfig } = validateConfig(config, mockLoadConfigInit());
            expect(validatedConfig.outputTargets).toEqual([
                {
                    type: 'dist-collection',
                    empty: false,
                    dir: defaultDir,
                    collectionDir: null,
                    transformAliasedImportPaths,
                },
            ]);
        });
    });
});
//# sourceMappingURL=validate-output-dist-collection.spec.js.map