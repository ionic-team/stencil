import * as d from '../../declarations';
import * as fs from 'fs';


export class NodeFs implements d.FileSystem {

  copyFile(src: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
      const readStream = fs.createReadStream(src);
      readStream.on('error', reject);

      const writeStream = fs.createWriteStream(dest);
      writeStream.on('error', reject);
      writeStream.on('close', resolve);

      readStream.pipe(writeStream);
    });
  }

  createReadStream(filePath: string) {
    return fs.createReadStream(filePath);
  }

  mkdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirPath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  mkdirSync(dirPath: string) {
    fs.mkdirSync(dirPath);
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

  rmdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.rmdir(dirPath, (err: any) => {
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
