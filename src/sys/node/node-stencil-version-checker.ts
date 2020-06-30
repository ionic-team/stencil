import { Config, PackageJsonData } from '../../declarations';
import { isString, noop } from '@utils';
import semiver from 'semiver';
import path from 'path';

const REGISTRY_URL = `https://registry.npmjs.org/@stencil/core`;
const CHECK_INTERVAL = 1000 * 60 * 60 * 24 * 7;

export async function checkVersion(config: Config, currentVersion: string): Promise<() => void> {
  if (config.devMode && !config.flags.ci) {
    try {
      const latestVersion = await getLatestCompilerVersion(config);
      if (latestVersion != null) {
        return () => {
          if (semiver(currentVersion, latestVersion) < 0) {
            printUpdateMessage(config, currentVersion, latestVersion);
          } else {
            console.debug(`${config.logger.cyan('@stencil/core')} version ${config.logger.green(currentVersion)} is the latest version`);
          }
        };
      }
    } catch (e) {
      config.logger.debug(`unable to load latest compiler version: ${e}`);
    }
  }
  return noop;
}

async function getLatestCompilerVersion(config: Config) {
  try {
    const lastCheck = await getLastCheck(config);
    if (lastCheck == null) {
      // we've never check before, so probably first install, so don't bother
      // save that we did just do a check though
      setLastCheck(config);
      return null;
    }

    if (!requiresCheck(Date.now(), lastCheck, CHECK_INTERVAL)) {
      // within the range that we did a check recently, so don't bother
      return null;
    }

    // remember we just did a check
    const setPromise = setLastCheck(config);

    const body = await requestUrl(REGISTRY_URL);
    const data = JSON.parse(body) as PackageJsonData;

    await setPromise;

    return data['dist-tags'].latest;
  } catch (e) {
    // quietly catch, could have no network connection which is fine
    config.logger.debug(`getLatestCompilerVersion error: ${e}`);
  }

  return null;
}

async function requestUrl(url: string) {
  const https = await import('https');

  return new Promise<string>((resolve, reject) => {
    const req = https.request(url, res => {
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

function requiresCheck(now: number, lastCheck: number, checkInterval: number) {
  return lastCheck + checkInterval < now;
}

async function getLastCheck(config: Config) {
  try {
    const data = await config.sys.readFile(getLastCheckStoragePath(config));
    if (isString(data)) {
      return JSON.parse(data);
    }
  } catch (e) {}
  return null;
}

async function setLastCheck(config: Config) {
  try {
    const now = JSON.stringify(Date.now());
    await config.sys.writeFile(getLastCheckStoragePath(config), now);
  } catch (e) {}
}

function getLastCheckStoragePath(config: Config) {
  return path.join(config.sys.tmpdir(), 'stencil_last_version_check.json');
}

function printUpdateMessage(config: Config, currentVersion: string, latestVersion: string) {
  const installMessage = `npm install @stencil/core`;
  const msg = [`Update available: ${currentVersion} ${ARROW} ${latestVersion}`, `To get the latest, please run:`, installMessage];

  const lineLength = msg[0].length;

  const o: string[] = [];

  let top = BOX_TOP_LEFT;
  while (top.length <= lineLength + PADDING * 2) {
    top += BOX_HORIZONTAL;
  }
  top += BOX_TOP_RIGHT;
  o.push(top);

  msg.forEach(m => {
    let line = BOX_VERTICAL;
    for (let i = 0; i < PADDING; i++) {
      line += ` `;
    }
    line += m;
    while (line.length <= lineLength + PADDING * 2) {
      line += ` `;
    }
    line += BOX_VERTICAL;
    o.push(line);
  });

  let bottom = BOX_BOTTOM_LEFT;
  while (bottom.length <= lineLength + PADDING * 2) {
    bottom += BOX_HORIZONTAL;
  }
  bottom += BOX_BOTTOM_RIGHT;
  o.push(bottom);

  let output = `\n${INDENT}${o.join(`\n${INDENT}`)}\n`;

  output = output.replace(currentVersion, config.logger.red(currentVersion));
  output = output.replace(latestVersion, config.logger.green(latestVersion));
  output = output.replace(installMessage, config.logger.cyan(installMessage));

  console.log(output);
}

const ARROW = `→`;
const BOX_TOP_LEFT = `╭`;
const BOX_TOP_RIGHT = `╮`;
const BOX_BOTTOM_LEFT = `╰`;
const BOX_BOTTOM_RIGHT = `╯`;
const BOX_VERTICAL = `│`;
const BOX_HORIZONTAL = `─`;
const PADDING = 2;
const INDENT = `           `;
