import { GraphData } from '../../util/interfaces';

export function remapData(graphData: GraphData) {
  return Object.keys(graphData)
    .reduce((allFiles: string[], key: string) => {
      return allFiles.concat(graphData[key]);
    }, [] as string[])
    .filter((fileName, index, array) => array.indexOf(fileName) === index)
    .reduce((allFiles: { [key: string]: string[] }, fileName: string) => {
      let listArray: string[] = [];

      for (let key in graphData) {
        if (graphData[key].indexOf(fileName) !== -1) {
          listArray.push(key);
        }
      }

      if (listArray.length > 1) {
        allFiles[fileName] = listArray;
      }

      return allFiles;
    }, {} as { [key: string]: any });
}


// Create weighting program so that we make informed judgements on when to split.
/**
 * Entry Points are very important
 */

/**
 * Should this be a common chunk?
 * - Has more than dependent file.
 * - How many children contain the same common file
 * - How large is the common file
 */

/**
 * Should this be grouped with another file?
 * - How many files do they have in common?
 * - What is the percentage of variance between files not in common?
 * - How large will the resulting file be?
 */


export function chunkCommonModules(graphData: GraphData) {
  return Object.keys(graphData)

    // Remove possible single file bundles
    .filter(graphKey => graphData[graphKey].length > 1)
    .reduce((all, graphKey) => {

      // If exact match then merge

      return {
        ...all,
        [graphKey]: graphData[graphKey]
      };
    }, {} as GraphData);
}

export function arrayDifferential(arrayA: string[], arrayB: string[]) {
  const AtoB = arrayA.filter(itemA => arrayB.indexOf(itemA) !== -1).length;
  const BtoA = arrayB.filter(itemB => arrayA.indexOf(itemB) !== -1).length;

  return {
    lengthDiff: Math.min(AtoB, BtoA),
    percentageDiff: Math.min(AtoB / arrayA.length, BtoA / arrayB.length)
  };
}
