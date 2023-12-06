import { mockLoadConfigInit } from '@stencil/core/testing';
import { isOutputTargetCopy, isOutputTargetHydrate, isOutputTargetWww, join } from '@utils';
import path from 'path';
import { createConfigFlags } from '../../../cli/config-flags';
import { validateConfig } from '../validate-config';
describe('validateOutputTargetWww', () => {
    // use Node's resolve() here to simulate a user using either Win/Posix separators (depending on the platform these
    // tests are run on)
    const rootDir = path.resolve('/');
    let userConfig;
    let flags;
    beforeEach(() => {
        flags = createConfigFlags();
        userConfig = {
            rootDir: rootDir,
            flags,
        };
    });
    it('should have default value', () => {
        const outputTarget = {
            type: 'www',
            // use Node's join() here to simulate a user using either Win/Posix separators (depending on the platform these
            // tests are run on) for their input
            dir: path.join('www', 'docs'),
        };
        userConfig.outputTargets = [outputTarget];
        userConfig.buildEs5 = false;
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toEqual([
            {
                appDir: join(rootDir, 'www', 'docs'),
                baseUrl: '/',
                buildDir: join(rootDir, 'www', 'docs', 'build'),
                dir: join(rootDir, 'www', 'docs'),
                empty: true,
                indexHtml: join(rootDir, 'www', 'docs', 'index.html'),
                polyfills: true,
                serviceWorker: {
                    dontCacheBustURLsMatching: /p-\w{8}/,
                    globDirectory: join(rootDir, 'www', 'docs'),
                    globIgnores: [
                        '**/host.config.json',
                        '**/*.system.entry.js',
                        '**/*.system.js',
                        '**/app.js',
                        '**/app.esm.js',
                        '**/app.css',
                    ],
                    globPatterns: ['*.html', '**/*.{js,css,json}'],
                    swDest: join(rootDir, 'www', 'docs', 'sw.js'),
                },
                type: 'www',
            },
            {
                dir: join(rootDir, 'www', 'docs', 'build'),
                esmDir: join(rootDir, 'www', 'docs', 'build'),
                isBrowserBuild: true,
                polyfills: true,
                systemDir: undefined,
                systemLoaderFile: undefined,
                type: 'dist-lazy',
            },
            {
                copyAssets: 'dist',
                dir: join(rootDir, 'www', 'docs', 'build'),
                type: 'copy',
            },
            {
                copy: [
                    {
                        src: 'assets',
                        warn: false,
                    },
                    {
                        src: 'manifest.json',
                        warn: false,
                    },
                ],
                dir: join(rootDir, 'www', 'docs'),
                type: 'copy',
            },
            {
                file: join(rootDir, 'www', 'docs', 'build', 'app.css'),
                type: 'dist-global-styles',
            },
        ]);
    });
    it('should www with sub directory', () => {
        const outputTarget = {
            type: 'www',
            // use Node's join() here to simulate a user using either Win/Posix separators (depending on the platform these
            // tests are run on) for their input
            dir: path.join('www', 'docs'),
        };
        userConfig.outputTargets = [outputTarget];
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        const www = config.outputTargets.find(isOutputTargetWww);
        expect(www.dir).toBe(join(rootDir, 'www', 'docs'));
        expect(www.appDir).toBe(join(rootDir, 'www', 'docs'));
        expect(www.buildDir).toBe(join(rootDir, 'www', 'docs', 'build'));
        expect(www.indexHtml).toBe(join(rootDir, 'www', 'docs', 'index.html'));
    });
    it('should set www values', () => {
        const outputTarget = {
            type: 'www',
            dir: 'my-www',
            buildDir: 'my-build',
            indexHtml: 'my-index.htm',
            empty: false,
        };
        userConfig.outputTargets = [outputTarget];
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        const www = config.outputTargets.find(isOutputTargetWww);
        expect(www.type).toBe('www');
        expect(www.dir).toBe(join(rootDir, 'my-www'));
        expect(www.buildDir).toBe(join(rootDir, 'my-www', 'my-build'));
        expect(www.indexHtml).toBe(join(rootDir, 'my-www', 'my-index.htm'));
        expect(www.empty).toBe(false);
    });
    it('should default to add www when outputTargets is undefined', () => {
        const { config } = validateConfig(userConfig, mockLoadConfigInit());
        expect(config.outputTargets).toHaveLength(5);
        const outputTarget = config.outputTargets.find(isOutputTargetWww);
        expect(outputTarget.dir).toBe(join(rootDir, 'www'));
        expect(outputTarget.buildDir).toBe(join(rootDir, 'www', 'build'));
        expect(outputTarget.indexHtml).toBe(join(rootDir, 'www', 'index.html'));
        expect(outputTarget.empty).toBe(true);
    });
    describe('baseUrl', () => {
        it('baseUrl does not end with / with dir set', () => {
            const outputTarget = {
                type: 'www',
                dir: 'my-www',
                baseUrl: '/docs',
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const www = config.outputTargets.find(isOutputTargetWww);
            expect(www.type).toBe('www');
            expect(www.dir).toBe(join(rootDir, 'my-www'));
            expect(www.baseUrl).toBe('/docs/');
            expect(www.appDir).toBe(join(rootDir, 'my-www/docs'));
            expect(www.buildDir).toBe(join(rootDir, 'my-www', 'docs', 'build'));
            expect(www.indexHtml).toBe(join(rootDir, 'my-www', 'docs', 'index.html'));
        });
        it('baseUrl does not end with /', () => {
            const outputTarget = {
                type: 'www',
                baseUrl: '/docs',
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const www = config.outputTargets.find(isOutputTargetWww);
            expect(www.type).toBe('www');
            expect(www.dir).toBe(join(rootDir, 'www'));
            expect(www.baseUrl).toBe('/docs/');
            expect(www.appDir).toBe(join(rootDir, 'www/docs'));
            expect(www.buildDir).toBe(join(rootDir, 'www', 'docs', 'build'));
            expect(www.indexHtml).toBe(join(rootDir, 'www', 'docs', 'index.html'));
        });
        it('baseUrl is a full url', () => {
            const outputTarget = {
                type: 'www',
                baseUrl: 'https://example.com/docs',
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const www = config.outputTargets.find(isOutputTargetWww);
            expect(www.type).toBe('www');
            expect(www.dir).toBe(join(rootDir, 'www'));
            expect(www.baseUrl).toBe('https://example.com/docs/');
            expect(www.appDir).toBe(join(rootDir, 'www/docs'));
            expect(www.buildDir).toBe(join(rootDir, 'www', 'docs', 'build'));
            expect(www.indexHtml).toBe(join(rootDir, 'www', 'docs', 'index.html'));
        });
    });
    describe('copy', () => {
        it('should add copy tasks', () => {
            const outputTarget = {
                type: 'www',
                // use Node's join() here to simulate a user using either Win/Posix separators (depending on the platform these
                // tests are run on) for their input
                dir: path.join('www', 'docs'),
                copy: [
                    {
                        src: 'index-modules.html',
                        dest: 'index-2.html',
                    },
                ],
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
            expect(copyTargets).toEqual([
                {
                    copyAssets: 'dist',
                    dir: join(rootDir, 'www', 'docs', 'build'),
                    type: 'copy',
                },
                {
                    copy: [
                        {
                            dest: 'index-2.html',
                            src: 'index-modules.html',
                        },
                        {
                            src: 'assets',
                            warn: false,
                        },
                        {
                            src: 'manifest.json',
                            warn: false,
                        },
                    ],
                    dir: join(rootDir, 'www', 'docs'),
                    type: 'copy',
                },
            ]);
        });
        it('should replace copy tasks', () => {
            const outputTarget = {
                type: 'www',
                // use Node's join() here to simulate a user using either Win/Posix separators (depending on the platform these
                // tests are run on) for their input
                dir: path.join('www', 'docs'),
                copy: [
                    {
                        src: 'assets',
                        dest: 'assets2',
                    },
                ],
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
            expect(copyTargets).toEqual([
                {
                    copyAssets: 'dist',
                    dir: join(rootDir, 'www', 'docs', 'build'),
                    type: 'copy',
                },
                {
                    copy: [
                        {
                            dest: 'assets2',
                            src: 'assets',
                        },
                        {
                            src: 'manifest.json',
                            warn: false,
                        },
                    ],
                    dir: join(rootDir, 'www', 'docs'),
                    type: 'copy',
                },
            ]);
        });
        it('should disable copy tasks', () => {
            const outputTarget = {
                type: 'www',
                // use Node's join() here to simulate a user using either Win/Posix separators (depending on the platform these
                // tests are run on) for their input
                dir: path.join('www', 'docs'),
                copy: null,
            };
            userConfig.outputTargets = [outputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
            expect(copyTargets).toEqual([
                {
                    copyAssets: 'dist',
                    dir: join(rootDir, 'www', 'docs', 'build'),
                    type: 'copy',
                },
                {
                    copy: [],
                    dir: join(rootDir, 'www', 'docs'),
                    type: 'copy',
                },
            ]);
        });
    });
    describe('dist-hydrate-script', () => {
        it('should not add hydrate by default', () => {
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets.some((o) => o.type === 'dist-hydrate-script')).toBe(false);
            expect(config.outputTargets.some((o) => o.type === 'www')).toBe(true);
        });
        it('should not add hydrate with user www', () => {
            const wwwOutputTarget = {
                type: 'www',
            };
            userConfig.outputTargets = [wwwOutputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets.some((o) => o.type === 'dist-hydrate-script')).toBe(false);
            expect(config.outputTargets.some((o) => o.type === 'www')).toBe(true);
        });
        it('should add hydrate with user hydrate and www outputs', () => {
            const wwwOutputTarget = {
                type: 'www',
            };
            const hydrateOutputTarget = {
                type: 'dist-hydrate-script',
            };
            userConfig.outputTargets = [wwwOutputTarget, hydrateOutputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets.some((o) => o.type === 'dist-hydrate-script')).toBe(true);
            expect(config.outputTargets.some((o) => o.type === 'www')).toBe(true);
        });
        it('should add hydrate with --prerender flag', () => {
            userConfig.flags = { ...flags, prerender: true };
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets.some((o) => o.type === 'dist-hydrate-script')).toBe(true);
            expect(config.outputTargets.some((o) => o.type === 'www')).toBe(true);
        });
        it('should add hydrate with --ssr flag', () => {
            userConfig.flags = { ...flags, ssr: true };
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            expect(config.outputTargets.some((o) => o.type === 'dist-hydrate-script')).toBe(true);
            expect(config.outputTargets.some((o) => o.type === 'www')).toBe(true);
        });
        it('should add externals and defaults', () => {
            const hydrateOutputTarget = {
                type: 'dist-hydrate-script',
                external: ['lodash', 'left-pad'],
            };
            userConfig.outputTargets = [hydrateOutputTarget];
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const o = config.outputTargets.find(isOutputTargetHydrate);
            expect(o.external).toContain('lodash');
            expect(o.external).toContain('left-pad');
            expect(o.external).toContain('fs');
            expect(o.external).toContain('path');
            expect(o.external).toContain('crypto');
        });
        it('should add node builtins to external by default', () => {
            userConfig.flags = { ...flags, prerender: true };
            const { config } = validateConfig(userConfig, mockLoadConfigInit());
            const o = config.outputTargets.find(isOutputTargetHydrate);
            expect(o.external).toContain('fs');
            expect(o.external).toContain('path');
            expect(o.external).toContain('crypto');
        });
    });
});
//# sourceMappingURL=validate-output-www.spec.js.map