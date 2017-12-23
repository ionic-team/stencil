import { GraphData } from '../../../util/interfaces';
import * as path from 'path';

export default function graphIt(graphData: GraphData, key: string) {

  return {
    name: 'graphItPlugin',
    resolveId(importee: string, importer: string) {
      if (!graphData[key]) {
        graphData[key] = [];
      }
      if (importee && graphData[key].indexOf(importee) === -1) {
        graphData[key].push(resolvePath(importee, importer));
      }
      if (importer && graphData[key].indexOf(importer) === -1) {
        graphData[key].push(importer);
      }
    }
  };
}

function resolvePath(importee: string, importer: string) {
  if (importee.charAt(0) === '.') {
    return path.resolve(importer, importee);
  }
  return importee;
}
