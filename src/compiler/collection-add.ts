import { BuildConfig } from './interfaces';
import { normalizeBuildConfig } from './build';


export function collectionAdd(buildConfig: BuildConfig) {
  normalizeBuildConfig(buildConfig);

  buildConfig.logger.error(`stencil collection add, coming soon...`);
}
