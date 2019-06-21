import * as d from '../declarations';
import { normalizePath } from '@utils';


export function shuffleArray(array: any[]) {
  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;
  let temporaryValue: any;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


export function expectFiles(fs: d.InMemoryFileSystem, filePaths: string[]) {
  filePaths.forEach(filePath => {
    fs.disk.statSync(filePath);
  });
}

export function doNotExpectFiles(fs: d.InMemoryFileSystem, filePaths: string[]) {
  filePaths.forEach(filePath => {
    try {
      fs.disk.statSync(filePath);
    } catch (e) {
      return;
    }

    if (fs.accessSync(filePath)) {
      throw new Error(`did not expect access: ${filePath}`);
    }
  });
}

export function wroteFile(r: d.BuildResults, p: string) {
  return r.filesWritten.some(f => {
    return normalizePath(f) === normalizePath(p);
  });
}
