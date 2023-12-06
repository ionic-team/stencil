import { JestFacade } from '../jest-facade';
import { createJestPuppeteerEnvironment } from './jest-environment';
import { createTestRunner } from './jest-runner';
import { runJest } from './jest-runner';
import { runJestScreenshot } from './jest-screenshot';
import { jestSetupTestFramework } from './jest-setup-test-framework';
/**
 * `JestFacade` implementation for communicating between this directory's version of Jest and Stencil
 */
export declare class Jest27Stencil implements JestFacade {
    getJestCliRunner(): typeof runJest;
    getRunJestScreenshot(): typeof runJestScreenshot;
    getDefaultJestRunner(): string;
    getCreateJestPuppeteerEnvironment(): typeof createJestPuppeteerEnvironment;
    getJestPreprocessor(): {
        process(sourceText: string, sourcePath: string, jestConfig: {
            instrument: boolean;
            rootDir: string;
        } | {
            config: {
                instrument: boolean;
                rootDir: string;
            };
        }, transformOptions?: {
            instrument: boolean;
            rootDir: string;
        }): string;
        getCacheKey(sourceText: string, sourcePath: string, jestConfigStr: string | {
            config: {
                instrument: boolean;
                rootDir: string;
            };
        }, transformOptions?: {
            instrument: boolean;
            rootDir: string;
        }): string;
    };
    getCreateJestTestRunner(): typeof createTestRunner;
    getJestSetupTestFramework(): typeof jestSetupTestFramework;
    getJestPreset(): Partial<{
        automock: boolean;
        bail: number | boolean;
        cache: boolean;
        cacheDirectory: string;
        ci: boolean;
        clearMocks: boolean;
        changedFilesWithAncestor: boolean;
        changedSince: string;
        collectCoverage: boolean;
        collectCoverageFrom: string[];
        collectCoverageOnlyFrom: {
            [key: string]: boolean;
        };
        coverageDirectory: string;
        coveragePathIgnorePatterns: string[];
        coverageProvider: "v8" | "babel";
        coverageReporters: import("@jest/types/build/Config").CoverageReporters;
        coverageThreshold: {
            [path: string]: import("@jest/types/build/Config").CoverageThresholdValue;
            global: import("@jest/types/build/Config").CoverageThresholdValue;
        };
        dependencyExtractor: string;
        detectLeaks: boolean;
        detectOpenHandles: boolean;
        displayName: string | import("@jest/types/build/Config").DisplayName;
        expand: boolean;
        extensionsToTreatAsEsm: string[];
        extraGlobals: string[];
        filter: string;
        findRelatedTests: boolean;
        forceCoverageMatch: string[];
        forceExit: boolean;
        json: boolean;
        globals: import("@jest/types/build/Config").ConfigGlobals;
        globalSetup: string;
        globalTeardown: string;
        haste: import("@jest/types/build/Config").HasteConfig;
        injectGlobals: boolean;
        reporters: (string | import("@jest/types/build/Config").ReporterConfig)[];
        logHeapUsage: boolean;
        lastCommit: boolean;
        listTests: boolean;
        maxConcurrency: number;
        maxWorkers: string | number;
        moduleDirectories: string[];
        moduleFileExtensions: string[];
        moduleLoader: string;
        moduleNameMapper: {
            [key: string]: string | string[];
        };
        modulePathIgnorePatterns: string[];
        modulePaths: string[];
        name: string;
        noStackTrace: boolean;
        notify: boolean;
        notifyMode: string;
        onlyChanged: boolean;
        onlyFailures: boolean;
        outputFile: string;
        passWithNoTests: boolean;
        preprocessorIgnorePatterns: string[];
        preset: string;
        prettierPath: string;
        projects: (string | import("@jest/types/build/Config").InitialProjectOptions)[];
        replname: string;
        resetMocks: boolean;
        resetModules: boolean;
        resolver: string;
        restoreMocks: boolean;
        rootDir: string;
        roots: string[];
        runner: string;
        runTestsByPath: boolean;
        scriptPreprocessor: string;
        setupFiles: string[];
        setupTestFrameworkScriptFile: string;
        setupFilesAfterEnv: string[];
        silent: boolean;
        skipFilter: boolean;
        skipNodeResolution: boolean;
        slowTestThreshold: number;
        snapshotResolver: string;
        snapshotSerializers: string[];
        snapshotFormat: import("@jest/types/build/Config").PrettyFormatOptions;
        errorOnDeprecated: boolean;
        testEnvironment: string;
        testEnvironmentOptions: Record<string, unknown>;
        testFailureExitCode: string | number;
        testLocationInResults: boolean;
        testMatch: string[];
        testNamePattern: string;
        testPathDirs: string[];
        testPathIgnorePatterns: string[];
        testRegex: string | string[];
        testResultsProcessor: string;
        testRunner: string;
        testSequencer: string;
        testURL: string;
        testTimeout: number;
        timers: "real" | "fake" | "modern" | "legacy";
        transform: {
            [regex: string]: string | import("@jest/types/build/Config").TransformerConfig;
        };
        transformIgnorePatterns: string[];
        watchPathIgnorePatterns: string[];
        unmockedModulePathPatterns: string[];
        updateSnapshot: boolean;
        useStderr: boolean;
        verbose?: boolean;
        watch: boolean;
        watchAll: boolean;
        watchman: boolean;
        watchPlugins: (string | [string, Record<string, unknown>])[];
    }>;
}
