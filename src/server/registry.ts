import * as fs from 'fs';
import * as path from 'path';


export function registerComponents(staticDir: string) {
  scanDirectory(staticDir);
}


function scanDirectory(dir: string) {
  const dirItems = fs.readdirSync(dir);

  dirItems.forEach(dirItem => {
    const readPath = path.join(dir, dirItem);

    if (isValidComponentFileName(dirItem)) {
      registerComponent(readPath);

    } else if (fs.statSync(readPath).isDirectory()) {
      scanDirectory(readPath);
    }
  });
}


function registerComponent(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');

  if (content.indexOf(`Ionic.loadComponents(`) > -1) {
    try {
      new Function(content)();

    } catch (e) {
      console.error(`registerComponent: ${e}`);
    }
  }
}


function isValidComponentFileName(fileName: string) {
  return /ionic\.(\d+)\.js/.test(fileName);
}
