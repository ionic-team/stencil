import * as d from '../declarations';
import exit from 'exit';


export function taskVersion(config: d.Config) {
  console.log(config.sys.compiler.version);
}


export async function taskCheckVersion(config: d.Config) {
  try {
    const currentVersion = config.sys.compiler.version;
    const latestVersion = await config.sys.getLatestCompilerVersion(config.logger, true);

    if (config.sys.semver.lt(currentVersion, latestVersion)) {
      printUpdateMessage(config.logger, currentVersion, latestVersion);

    } else {
      console.log(`${config.logger.cyan(config.sys.compiler.name)} version ${config.logger.green(config.sys.compiler.version)} is the latest version`);
    }

  } catch (e) {
    config.logger.error(`unable to load latest compiler version: ${e}`);
    exit(1);
  }
}


export async function validateCompilerVersion(sys: d.StencilSystem, logger: d.Logger, latestVersionPromise: Promise<string>) {
  const latestVersion = await latestVersionPromise;
  if (latestVersion == null) {
    return;
  }

  const currentVersion = sys.compiler.version;

  if (sys.semver.lt(currentVersion, latestVersion)) {
    printUpdateMessage(logger, currentVersion, latestVersion);
  }
}


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
