import { BuildResults, InMemoryFileSystem } from '../declarations';
import { normalizePath } from '../compiler/util';

export function testProperties(instance: any, properties: { [prop: string]: any }) {
  const keys = Object.keys(properties);
  for (const prop of keys) {
    if (!instance[prop] === properties[prop]) {
      throw new Error(`expected property "${prop}", but it was not found`);
    }
  }
}

export function testClasslist(el: HTMLElement, classes: string[]) {
  for (const c of classes) {
    if (!el.classList.contains(c)) {
      throw new Error(`expected class "${c}", but it was not found`);
    }
  }
}

export function testAttributes(el: HTMLElement, attributes: { [attr: string]: string }) {
  const keys = Object.keys(attributes);

  for (const attr of keys) {
    if (!el.hasAttribute(attr)) {
      throw new Error(`expected attribute "${attr}", but it was not found`);
    }
    if (el.getAttribute(attr) !== attributes[attr]) {
      throw new Error(`expected attribute "${attr}" to be equal to "${attributes[attr]}", but it is "${el.getAttribute(attr)}"`);
    }
  }
}

export function testMatchAttributes(el: HTMLElement, attributes: { [attr: string]: string }) {
  testAttributes(el, attributes);
}

export function testMatchClasslist(el: HTMLElement, classes: string[]) {
  const expected = classes.slice().filter(c => c.length > 0).sort().join(' ').trim();
  const received = el.className.split(' ').filter(c => c.length > 0).sort().join(' ').trim();

  if (expected !== received) {
    throw new Error(`expected css class${classes.length > 1 ? 'es' : ''} "${expected}", but received "${received}"`);
  }

  testClasslist(el, classes);
}

export function expectFiles(fs: InMemoryFileSystem, filePaths: string[]) {
  filePaths.forEach(filePath => {
    fs.disk.statSync(filePath);
  });
}

export function doNotExpectFiles(fs: InMemoryFileSystem, filePaths: string[]) {
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

export function wroteFile(r: BuildResults, p: string) {
  return r.filesWritten.some(f => {
    return normalizePath(f) === normalizePath(p);
  });
}

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
