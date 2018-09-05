
export interface E2EData {
  masterSnapshotId: string;
  snapshots: E2ESnapshot[];
}


export interface E2ESnapshot {
  id: string;
  msg?: string;
  repoUrl?: string;
  imagesDir?: string;
  dataDir?: string;
  appRootDir?: string;
  packageDir?: string;
  timestamp: number;
  screenshots?: E2EScreenshot[];
  compilerVersion?: string;
  channel?: string;
}


export interface E2EScreenshot {
  id: string;
  desc: string;
  image: string;
  device?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  mediaType?: string;
}


export interface ScreenshotConnector {
  deleteSnapshot(snapshotId: string): Promise<E2EData>;
  getData(): Promise<E2EData>;
  getMasterSnapshot(): Promise<E2ESnapshot>;
  getSnapshot(snapshotId: string): Promise<E2ESnapshot>;
  postSnapshot(snapshot: E2ESnapshot): Promise<void>;
  readImage(imageFileName: string): any;
  setMasterSnapshot(snapshotId: string): Promise<E2EData>;
}


export interface ScreenshotServer {
  start(connector: ScreenshotConnector): Promise<void>;
  getRootUrl(): string;
  getCompareUrl(snapshotIdA: string, snapshotIdB: string): string;
  getSnapshotUrl(snapshotId: string): string;
  isListening(): boolean;
}
