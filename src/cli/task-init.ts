import { Logger, StencilSystem } from '../declarations';


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


const DEFAULT_CONFIG = `
exports.config = {
  namespace: 'App',
  collections: []
};

exports.devServer = {
  root: 'www'
};
`;
