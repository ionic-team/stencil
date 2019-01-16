import * as d from '../../declarations';
import { pathJoin } from '@stencil/core/utils';


export function writeCacheStats(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.enableCacheStats) {
    return;
  }

  const statsPath = pathJoin(config, config.rootDir, 'stencil-cache-stats.json');

  config.logger.warn(`cache stats enabled for debugging, which is horrible for build times. Only enableCacheStats when debugging memory issues.`);

  const timeSpan = config.logger.createTimeSpan(`cache stats started: ${statsPath}`);

  let statsData: any = {};
  try {
    const dataStr = compilerCtx.fs.disk.readFileSync(statsPath);
    statsData = JSON.parse(dataStr);
  } catch (e) {}

  statsData['compilerCtx'] = statsData['compilerCtx'] || {};
  getObjectSize(statsData['compilerCtx'], compilerCtx);

  statsData['compilerCtx.cache.cacheFs.items'] = statsData['compilerCtx.cache.cacheFs.items'] || {};
  getObjectSize(statsData['compilerCtx.cache.cacheFs.items'], (compilerCtx.cache as any)['cacheFs']['items']);

  statsData['buildCtx'] = statsData['buildCtx'] || {};
  getObjectSize(statsData['buildCtx'], buildCtx);

  compilerCtx.fs.disk.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));

  timeSpan.finish(`cache stats finished`);
}


export function getObjectSize(data: any, obj: any) {
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        const size = objectSizeEstimate(obj[key]);
        if (size > 20000) {
          data[key] = data[key] || [];
          data[key].push(size);
        }
      }
    });
  }
}


export function objectSizeEstimate(obj: any) {
  if (!obj) {
    return 0;
  }

  const objectList: any[] = [];
  const stack = [obj];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;

    } else if (typeof value === 'string') {
      bytes += value.length * 2;

    } else if (typeof value === 'number') {
      bytes += 8;

    } else if (typeof value === 'object' && !objectList.includes(value)) {
      objectList.push(value);

      for (const i in value) {
        stack.push(value[i]);
      }
    }
  }

  return bytes;
}
