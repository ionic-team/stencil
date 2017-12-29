import { Logger } from '../util/interfaces';


export function initApp(process: NodeJS.Process, logger: Logger) {
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(process.cwd(), 'stencil.config.js');

  try {
    fs.writeFileSync(configPath, DEFAULT_CONFIG);
    logger.info(`Created config: ${configPath}`);

  } catch (e) {
    logger.error(e);
  }
}


var DEFAULT_CONFIG = `
exports.config = {
  namespace: 'App',
  bundles: [],
  collections: []
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
`;
