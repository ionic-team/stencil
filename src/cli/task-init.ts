import { Logger, StencilSystem } from '../util/interfaces';


export async function initApp(process: NodeJS.Process, sys: StencilSystem, logger: Logger) {
  const configPath = sys.path.join(process.cwd(), 'stencil.config.js');

  try {
    const fs = require('fs');
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
