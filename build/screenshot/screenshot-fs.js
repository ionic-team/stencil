import fs from 'fs';
import path from 'path';
export async function writeScreenshotImage(imagePath, screenshotBuf) {
    const imageExists = await fileExists(imagePath);
    if (!imageExists) {
        await writeFile(imagePath, screenshotBuf);
    }
}
export async function writeScreenshotData(dataDir, screenshotData) {
    const filePath = getDataFilePath(dataDir, screenshotData.id);
    const content = JSON.stringify(screenshotData, null, 2);
    await writeFile(filePath, content);
}
export async function readScreenshotData(dataDir, screenshotId) {
    let rtn = null;
    try {
        const dataFilePath = getDataFilePath(dataDir, screenshotId);
        const dataContent = await readFile(dataFilePath);
        rtn = JSON.parse(dataContent);
    }
    catch (e) { }
    return rtn;
}
function getDataFilePath(dataDir, screenshotId) {
    const fileName = `${screenshotId}.json`;
    return path.join(dataDir, fileName);
}
export function fileExists(filePath) {
    return new Promise((resolve) => {
        fs.access(filePath, (err) => resolve(!err));
    });
}
export function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
export function readFileBuffer(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
export function writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
export function mkDir(filePath) {
    return new Promise((resolve) => {
        fs.mkdir(filePath, () => {
            resolve();
        });
    });
}
export function rmDir(filePath) {
    return new Promise((resolve) => {
        fs.rmdir(filePath, () => {
            resolve();
        });
    });
}
export async function emptyDir(dir) {
    const files = await readDir(dir);
    const promises = files.map(async (fileName) => {
        const filePath = path.join(dir, fileName);
        const isDirFile = await isFile(filePath);
        if (isDirFile) {
            await unlink(filePath);
        }
    });
    await Promise.all(promises);
}
export async function readDir(dir) {
    return new Promise((resolve) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                resolve([]);
            }
            else {
                resolve(files);
            }
        });
    });
}
export async function isFile(itemPath) {
    return new Promise((resolve) => {
        fs.stat(itemPath, (err, stat) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(stat.isFile());
            }
        });
    });
}
export async function unlink(filePath) {
    return new Promise((resolve) => {
        fs.unlink(filePath, () => {
            resolve();
        });
    });
}
//# sourceMappingURL=screenshot-fs.js.map