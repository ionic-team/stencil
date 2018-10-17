import { createReadStream } from 'fs';
import { join } from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


export async function getMismatchedPixels(imagesDir: string, masterImageName: string, currentImageBuf: Buffer, width: number, height: number, pixelmatchThreshold: number) {
  const masterImageBuf = await readImage(imagesDir, masterImageName);

  const mismatchedPixels = pixelmatch(masterImageBuf, currentImageBuf, null, width, height, {
    threshold: pixelmatchThreshold,
    includeAA: false
  });

  return mismatchedPixels;
}


function readImage(imagesDir: string, image: string) {
  return new Promise<Buffer>(resolve => {
    const filePath = join(imagesDir, image);

    const rs = createReadStream(filePath);

    rs.pipe(new PNG()).on('parsed', resolve);
  });
}
