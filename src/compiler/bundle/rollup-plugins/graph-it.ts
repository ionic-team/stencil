import { BuildConfig, GraphData } from '../../../util/interfaces';


export default function graphIt(config: BuildConfig, graphData: GraphData) {
  config;

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
        graphData.set(importer, graphData.get(importer).concat(importee));
      }
      if (importer && graphData.get(importer).indexOf(importer) === -1) {
        graphData.set(importer, graphData.get(importer).concat(importer));
      }
    }
  };
}
