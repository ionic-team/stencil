import { StencilSystem } from './interfaces';


export function initApp(sys: StencilSystem, dirPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const configPath = sys.path.join(dirPath, 'stencil.config.js');

    sys.fs.writeFile(configPath, DEFAULT_CONFIG, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(configPath);
      }
    });
  });
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
