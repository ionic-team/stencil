import crypto from 'crypto';
import fs from 'fs';
import { readFile, writeFile } from './screenshot-fs';
import path from 'path';


export async function getMismatchedPixels(cacheDir: string, imageDir: string, masterImageName: string, localImageName: string, width: number, height: number, pixelmatchThreshold: number) {
  const cacheKey = getCacheKey(masterImageName, localImageName, width, height, pixelmatchThreshold);
  const diffJsonPath = path.join(cacheDir, `mismatch_${cacheKey}.json.log`);

  try {
    const diffData = JSON.parse(await readFile(diffJsonPath)) as DiffData;
    if (diffData && typeof diffData.mismatch === 'number') {
      return diffData.mismatch;
    }
  } catch (e) {}

  const images = await Promise.all([
    readImage(imageDir, masterImageName),
    readImage(imageDir, localImageName)
  ]);

  const pixelmatch = require('pixelmatch');

  const mismatchedPixels = pixelmatch(images[0], images[1], null, width, height, {
    threshold: pixelmatchThreshold,
    includeAA: false
  });

  const diffData: DiffData = {
    mismatch: mismatchedPixels
  };

  try {
    await writeFile(diffJsonPath, JSON.stringify(diffData));
  } catch (e) {}

  return diffData.mismatch;
}


function getCacheKey(masterImageName: string, localImageName: string, width: number, height: number, pixelmatchThreshold: number) {
  const hash = crypto.createHash('md5');

  hash.update(masterImageName);
  hash.update(localImageName);
  hash.update(width.toString());
  hash.update(height.toString());
  hash.update(pixelmatchThreshold.toString());

  return hash.digest('hex').toLowerCase();
}


function readImage(imagesDir: string, image: string) {
  return new Promise<Buffer>(resolve => {
    const { PNG } = require('pngjs');
    const filePath = path.join(imagesDir, image);

    const rs = fs.createReadStream(filePath);

    rs.pipe(new PNG()).on('parsed', resolve);
  });
}


interface DiffData {
  mismatch: number;
}
