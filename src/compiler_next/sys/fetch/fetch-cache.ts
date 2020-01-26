import { HAS_FETCH_CACHE, isString } from '@utils';
import { version } from '../../../version';


const activeFetches = new Map<string, Promise<Response>>();

export const cachedFetch = async (url: string) => {
  const immutableCache = HAS_FETCH_CACHE ? await caches.open(CACHES.immutable) : null;
  if (immutableCache) {
    const cachedImmutableRsp = await immutableCache.match(url);
    if (cachedImmutableRsp) {
      return cachedImmutableRsp;
    }
  }

  if (HAS_FETCH_CACHE && isCoreResource(url)) {
    const coreCache = await caches.open(CACHES.core);
    const cachedCoreRsp = await coreCache.match(url);
    if (cachedCoreRsp) {
      return cachedCoreRsp;
    }
  }

  const activeFetch = activeFetches.get(url);
  if (activeFetch) {
    return activeFetch;
  }

  try {
    const fetchPromise = fetch(url);
    activeFetches.set(url, fetchPromise);

    const fetchRsp = await fetchPromise;

    if (HAS_FETCH_CACHE && fetchRsp.ok) {
      if (isCoreResource(url)) {
        const coreCache = await caches.open(CACHES.core);
        coreCache.put(url, fetchRsp.clone());

      } else if (isImmutableResponse(fetchRsp)) {
        immutableCache.put(url, fetchRsp.clone());

      } else if (HAS_FETCH_CACHE) {
        const offlineCache = await caches.open(CACHES.offline);
        offlineCache.put(url, fetchRsp.clone());
      }
    }

    return fetchRsp;

  } catch (e) {
    if (HAS_FETCH_CACHE) {
      const offlineReqCache = await caches.open(CACHES.offline);
      const cachedOfflineRsp = await offlineReqCache.match(url);
      if (cachedOfflineRsp) {
        return cachedOfflineRsp;
      }
    }
  }

  return null;
};

export const isImmutableResponse = (rsp: Response) => {
  if (rsp && rsp.ok && rsp.headers) {
    const cacheControl = rsp.headers.get('Cache-Control');
    if (isString(cacheControl)) {
      if (cacheControl.includes('immutable')) {
        return true;
      }
    }
  }
  return false;
};

export const cleanFetchCache = async () => {
  if (HAS_FETCH_CACHE) {
    try {
      const currentCacheKeys = Object.values(CACHES);
      const cacheKeys = await caches.keys();

      const invalidCacheKeys = cacheKeys.filter(k => {
        return !currentCacheKeys.includes(k);
      });

      await Promise.all(invalidCacheKeys.map(k => {
        return caches.delete(k);
      }));

    } catch (e) {}
  }
};

export const CACHES = {
  core: `stencil_core_${version}`,
  immutable: `stencil_immutable`,
  offline: `stencil_offline`,
};


const isCoreResource = (url: string) => CORE_RESOURCES.some(u => url.includes(u));

const CORE_RESOURCES = [
  '/@stencil/core/',
  '/@stencil/core@',
  '/typescript/',
  '/typescript@',
];
