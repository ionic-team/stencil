import './polyfills';

export { BuildContext } from './build/build-ctx';
export { Cache } from './cache';
export { Compiler } from './compiler';
export { COMPILER_BUILD } from './build/compiler-build-id';
export { Config } from '../declarations';
export { formatComponentRuntimeMeta, formatLazyBundleRuntimeMeta } from './app-core/format-component-runtime-meta';
export { getBuildFeatures } from './app-core/build-conditionals';
export { transpileModule } from './transpile/transpile-module';
export { validateConfig } from './config/validate-config';
