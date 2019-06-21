import * as d from '../../declarations';
import { request } from 'https';


export async function getLatestCompilerVersion(storage: d.Storage, logger: d.Logger, forceCheck: boolean) {
  try {
    if (!forceCheck) {
      const lastCheck = await getLastCheck(storage);
      if (lastCheck == null) {
        // we've never check before, so probably first install, so don't bother
        // save that we did just do a check though
        await setLastCheck(storage);
        return null;
      }

      if (!requiresCheck(Date.now(), lastCheck, CHECK_INTERVAL)) {
        // within the range that we did a check recently, so don't bother
        return null;
      }
    }

    // remember we just did a check
    await setLastCheck(storage);

    const body = await requestUrl(REGISTRY_URL);
    const data = JSON.parse(body) as d.PackageJsonData;
    const latestVersion = data['dist-tags'].latest;
    return latestVersion;

  } catch (e) {
    // quietly catch, could have no network connection which is fine
    logger.debug(`checkVersion error: ${e}`);
  }

  return null;
}

async function requestUrl(url: string) {
  return new Promise<string>((resolve, reject) => {
    const req = request(url, res => {
      if (res.statusCode > 299) {
        reject(`url: ${url}, staus: ${res.statusCode}`);
        return;
      }

      res.once('error', reject);

      const ret: any = [];
      res.once('end', () => {
        resolve(ret.join(''));
      });

      res.on('data', data => {
        ret.push(data);
      });
    });
    req.once('error', reject);
    req.end();
  });
}

const REGISTRY_URL = `https://registry.npmjs.org/@stencil/core`;


export function requiresCheck(now: number, lastCheck: number, checkInterval: number) {
  return ((lastCheck + checkInterval) < now);
}

const CHECK_INTERVAL = (1000 * 60 * 60 * 24 * 7);

function getLastCheck(storage: d.Storage): Promise<number> {
  return storage.get(STORAGE_KEY);
}

function setLastCheck(storage: d.Storage) {
  return storage.set(STORAGE_KEY, Date.now());
}

const STORAGE_KEY = 'last_version_check';
