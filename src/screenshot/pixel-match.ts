import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { readFile, writeFile } from './screenshot-fs';
import { join } from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


export async function getMismatchedPixels(cacheDir: string, imagesDir: string, masterImageName: string, localImageName: string, width: number, height: number, pixelmatchThreshold: number) {

  const cacheKey = getCacheKey(masterImageName, localImageName, width, height, pixelmatchThreshold);
  const diffJsonPath = join(cacheDir, `mismatch_${cacheKey}.json.log`);

  try {
    const diffData = JSON.parse(await readFile(diffJsonPath)) as DiffData;
    if (diffData && typeof diffData.mismatch === 'number') {
      return diffData.mismatch;
    }
  } catch (e) {}

  const images = await Promise.all([
    readImage(imagesDir, masterImageName),
    readImage(imagesDir, localImageName)
  ]);

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
  const hash = createHash('md5');

  hash.update(masterImageName);
  hash.update(localImageName);
  hash.update(width.toString());
  hash.update(height.toString());
  hash.update(pixelmatchThreshold.toString());

  return hash.digest('hex').toLowerCase();
}


function readImage(imagesDir: string, image: string) {
  return new Promise<Buffer>(resolve => {
    const filePath = join(imagesDir, image);

    const rs = createReadStream(filePath);

    rs.pipe(new PNG()).on('parsed', resolve);
  });
}


interface DiffData {
  mismatch: number;
}
