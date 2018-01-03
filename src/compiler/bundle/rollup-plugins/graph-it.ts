import { BuildConfig, GraphData } from '../../../util/interfaces';


export default function graphIt(config: BuildConfig, graphData: GraphData) {

  return {
    name: 'graphItPlugin',

    resolveId(importee: string, importer: string) {
      if (!importer) {
        return;
      }
      if (!graphData.has(importer)) {
        graphData.set(importer, []);
      }
      if (importee && graphData.get(importer).indexOf(importee) === -1) {
        const path = resolvePath(config, importee, importer);
        graphData.set(importer, graphData.get(importer).concat(path));
      }
      if (importer && graphData.get(importer).indexOf(importer) === -1) {
        graphData.set(importer, graphData.get(importer).concat(importer));
      }
    }
  };
}


function resolvePath(config: BuildConfig, importee: string, importer: string) {
  if (importee.charAt(0) === '.') {
    return config.sys.path.resolve(importer, importee);
  }
  return importee;
}
