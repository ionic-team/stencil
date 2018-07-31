import * as d from '../../declarations';
import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';


export class NodeStorage implements d.Storage {
  private storagePath: string;
  private data: any;

  constructor(private fs: d.FileSystem) {
    const appKey = crypto.createHash('md5').update(__dirname).digest('base64').replace(/\W/g, '');
    const storageFile = `stencil-storage-${appKey}.json`;
    this.storagePath = path.join(os.tmpdir(), storageFile);
  }

  async get(key: string) {
    const data = await this.readData();
    return data[key];
  }

  async set(key: string, value: any) {
    const data = await this.readData();
    data[key] = value;
    this.writeData();
  }

  private async readData() {
    if (!this.data) {
      try {
        const dataStr = await this.fs.readFile(this.storagePath);
        this.data = JSON.parse(dataStr);
      } catch (e) {
        this.data = {};
      }
    }
    return this.data;
  }

  private writeData() {
    try {
      const dataStr = JSON.stringify(this.data, null, 2);
      this.fs.writeFileSync(this.storagePath, dataStr);
    } catch (e) {}
  }

}
