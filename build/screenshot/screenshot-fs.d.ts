/// <reference types="node" />
import type * as d from '@stencil/core/internal';
export declare function writeScreenshotImage(imagePath: string, screenshotBuf: Buffer): Promise<void>;
export declare function writeScreenshotData(dataDir: string, screenshotData: d.Screenshot): Promise<void>;
export declare function readScreenshotData(dataDir: string, screenshotId: string): Promise<d.Screenshot>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function readFile(filePath: string): Promise<string>;
export declare function readFileBuffer(filePath: string): Promise<Buffer>;
export declare function writeFile(filePath: string, data: any): Promise<void>;
export declare function mkDir(filePath: string): Promise<void>;
export declare function rmDir(filePath: string): Promise<void>;
export declare function emptyDir(dir: string): Promise<void>;
export declare function readDir(dir: string): Promise<string[]>;
export declare function isFile(itemPath: string): Promise<boolean>;
export declare function unlink(filePath: string): Promise<void>;
