/*!
 * This file acts as the connector/bridge between Stencil and Jest.
 *
 * It defines/caches a `JestFacade` implementation to dispatch Jest-related configuration calls to the correct section
 * of the Stencil codebase.
 *
 * It contains the APIs that are designed to be used by the Jest pre-configurations supplied by Stencil.
 */
import { JestCliRunner, JestPresetConfig, JestScreenshotRunner } from './jest-apis';
/**
 * Retrieve the numeric representation of the major version of Jest being used.
 *
 * If a user has Jest v27.1.0 installed, `27` will be returned.
 *
 * @returns the major version of Jest detected
 */
export declare const getVersion: () => number;
/**
 * Retrieve the default Jest runner name prescribed by Stencil
 *
 * @returns the stringified name of the test runner, based on the currently detected version of Stencil
 */
export declare const getDefaultJestRunner: () => string;
/**
 * Retrieve the Stencil-Jest test runner based on the version of Jest that's installed.
 *
 * @returns a test runner for Stencil tests, based on the version of Jest that's detected
 */
export declare const getRunner: () => JestCliRunner;
/**
 * Retrieve the Stencil-Jest screenshot facade implementation based on the version of Jest that's installed.
 *
 * @returns a screenshot facade implementation for Stencil tests, based on the version of Jest that's detected
 */
export declare const getScreenshot: () => JestScreenshotRunner;
/**
 * Retrieve the Jest-Puppeteer Environment, based on the version of Jest that is installed
 *
 * @returns a function capable of creating a Jest-Puppeteer environment
 */
export declare const getCreateJestPuppeteerEnvironment: () => () => import("./jest-apis").JestPuppeteerEnvironmentConstructor;
/**
 * Retrieve the Jest preprocessor, based on the version of Jest that is installed
 *
 * @returns a Jest preprocessor to transform code at test time
 */
export declare const getJestPreprocessor: () => import("./jest-apis").JestPreprocessor;
/**
 * Retrieve the Jest-Runner, based on the version of Jest that is installed
 *
 * @returns a function capable of creating a Jest test runner
 */
export declare const getCreateJestTestRunner: () => () => import("./jest-apis").JestTestRunnerConstructor;
/**
 * Retrieve the Jest-setup function, based on the version of Jest that is installed
 *
 * @returns a function capable of setting up Jest
 */
export declare const getJestSetupTestFramework: () => () => void;
/**
 * Retrieve Stencil's Jest presets for the detected version of Jest
 *
 * @returns an object representing a Jest preset
 */
export declare const getJestPreset: () => JestPresetConfig;
