import { FileSystem } from '../../declarations';
import * as fs from 'fs';


export class NodeFs implements FileSystem {

  copyFile(src: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
      const rd = fs.createReadStream(src);
      rd.on('error', reject);

      const wr = fs.createWriteStream(dest);
      wr.on('error', reject);
      wr.on('close', resolve);

      rd.pipe(wr);
    });
  }

  mkdir(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(filePath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  readdir(dirPath: string) {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(dirPath, (err: any, files: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  readFile(filePath: string) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err: any, content: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  readFileSync(filePath: string) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  rmdir(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.rmdir(filePath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  stat(itemPath: string) {
    return new Promise<any>((resolve, reject) => {
      fs.stat(itemPath, (err: any, stats: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  }

  statSync(itemPath: string) {
    return fs.statSync(itemPath);
  }

  unlink(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeFile(filePath: string, content: string) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, content, { encoding: 'utf-8' }, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeFileSync(filePath: string, content: string) {
    return fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  }

}
