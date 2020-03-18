import * as d from '../../declarations';
import { request } from 'https';
import exit from 'exit';
import semiver from 'semiver';


const REGISTRY_URL = `https://registry.npmjs.org/@stencil/core`;
const CHECK_INTERVAL = (1000 * 60 * 60 * 24 * 7);


export async function taskVersion() {
  const { version } = await import('@stencil/core/compiler');
  console.log(version);
}

export async function taskCheckVersion(config: d.Config) {
  try {
    const { version } = await import('@stencil/core/compiler');
    const latestVersion = await getLatestCompilerVersion(config, true);

    if (semiver(version, latestVersion) < 0) {
      printUpdateMessage(config.logger, version, latestVersion);

    } else {
      console.log(`${config.logger.cyan('@stencil/core')} version ${config.logger.green(version)} is the latest version`);
    }

  } catch (e) {
    config.logger.error(`unable to load latest compiler version: ${e}`);
    exit(1);
  }
}

async function getLatestCompilerVersion(config: d.Config, forceCheck: boolean) {
  try {
    if (!forceCheck) {
      const lastCheck = await getLastCheck(config);
      if (lastCheck == null) {
        // we've never check before, so probably first install, so don't bother
        // save that we did just do a check though
        await setLastCheck(config);
        return null;
      }

      if (!requiresCheck(Date.now(), lastCheck, CHECK_INTERVAL)) {
        // within the range that we did a check recently, so don't bother
        return null;
      }
    }

    // remember we just did a check
    await setLastCheck(config);

    const body = await requestUrl(REGISTRY_URL);
    const data = JSON.parse(body) as d.PackageJsonData;
    const latestVersion = data['dist-tags'].latest;
    return latestVersion;

  } catch (e) {
    // quietly catch, could have no network connection which is fine
    config.logger.debug(`checkVersion error: ${e}`);
  }

  return null;
}

async function validateCompilerVersion(logger: d.Logger, latestVersionPromise: Promise<string>) {
  const latestVersion = await latestVersionPromise;
  if (latestVersion == null) {
    return;
  }

  const { version } = await import('@stencil/core/compiler');

  if (semiver(version, latestVersion) < 0) {
    printUpdateMessage(logger, version, latestVersion);
  }
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


function requiresCheck(now: number, lastCheck: number, checkInterval: number) {
  return ((lastCheck + checkInterval) < now);
}


function getLastCheck(config: d.Config): Promise<number> {
  return config.sys_next.cacheStorage.get(STORAGE_KEY);
}

function setLastCheck(config: d.Config) {
  return config.sys_next.cacheStorage.set(STORAGE_KEY, Date.now());
}

const STORAGE_KEY = 'last_version_check';


function printUpdateMessage(logger: d.Logger, currentVersion: string, latestVersion: string) {
  const msg = [
    `Update available: ${currentVersion} ${ARROW} ${latestVersion}`,
    `To get the latest, please run:`,
    NPM_INSTALL
  ];

  const lineLength = msg[0].length;

  const o: string[] = [];

  let top = BOX_TOP_LEFT;
  while (top.length <= lineLength + (PADDING * 2)) {
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
    while (line.length <= lineLength + (PADDING * 2)) {
      line += ` `;
    }
    line += BOX_VERTICAL;
    o.push(line);
  });

  let bottom = BOX_BOTTOM_LEFT;
  while (bottom.length <= lineLength + (PADDING * 2)) {
    bottom += BOX_HORIZONTAL;
  }
  bottom += BOX_BOTTOM_RIGHT;
  o.push(bottom);

  let output = `\n${INDENT}${o.join(`\n${INDENT}`)}\n`;

  output = output.replace(currentVersion, logger.red(currentVersion));
  output = output.replace(latestVersion, logger.green(latestVersion));
  output = output.replace(NPM_INSTALL, logger.cyan(NPM_INSTALL));

  console.log(output);
}

const NPM_INSTALL = `npm install @stencil/core`;
const ARROW = `→`;
const BOX_TOP_LEFT = `╭`;
const BOX_TOP_RIGHT = `╮`;
const BOX_BOTTOM_LEFT = `╰`;
const BOX_BOTTOM_RIGHT = `╯`;
const BOX_VERTICAL = `│`;
const BOX_HORIZONTAL = `─`;
const PADDING = 2;
const INDENT = `           `;
