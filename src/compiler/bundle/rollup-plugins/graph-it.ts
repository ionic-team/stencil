import { BuildConfig, GraphData } from '../../../util/interfaces';
import * as path from 'path';


export default function graphIt(config: BuildConfig, graphData: GraphData) {
  config;

  return {
    name: 'graphItPlugin',

    resolveId(importee: string, importer: string) {
      if (!importer) {
        return;
      }

      const prevData = graphData.get(importer) || [];
      if (importee && prevData.indexOf(importee) === -1) {
        if (!importee.startsWith('./') && !importee.startsWith('../')) {
          return;
        }
        const dir = path.dirname(importer);
        const importFullPath = path.resolve(dir, importee);

        graphData.set(importer, prevData.concat(importFullPath));
      }
    }
  };
}
