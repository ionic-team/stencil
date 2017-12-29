import { BuildConfig, GraphData } from '../../../util/interfaces';


export default function graphIt(config: BuildConfig, graphData: GraphData, key: string) {

  return {
    name: 'graphItPlugin',

    resolveId(importee: string, importer: string) {
      if (!graphData[key]) {
        graphData[key] = [];
      }
      if (importee && graphData[key].indexOf(importee) === -1) {
        graphData[key].push(resolvePath(config, importee, importer));
      }
      if (importer && graphData[key].indexOf(importer) === -1) {
        graphData[key].push(importer);
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
