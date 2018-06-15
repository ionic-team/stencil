import * as d from '../../declarations';
import * as fs from 'fs';


export class NodeFs implements d.FileSystem {

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

  createReadStream(path: string) {
    return fs.createReadStream(path);
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
      fs.readFile(filePath, 'utf8', (err: any, content: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  readFileSync(filePath: string) {
    return fs.readFileSync(filePath, 'utf8');
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
    return new Promise<d.FsStats>((resolve, reject) => {
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  }

  statSync(itemPath: string): d.FsStats {
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
      fs.writeFile(filePath, content, { encoding: 'utf8' }, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeFileSync(filePath: string, content: string) {
    return fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  }

}
