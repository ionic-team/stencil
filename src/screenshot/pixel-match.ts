import * as d from '../declarations';
import fs from 'graceful-fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


function getMismatchedPixels(pixelMatchInput: d.PixelMatchInput) {
  const imgA = fs.createReadStream(pixelMatchInput.imageAPath).pipe(new PNG()).on('parsed', doneReading);
  const imgB = fs.createReadStream(pixelMatchInput.imageBPath).pipe(new PNG()).on('parsed', doneReading);

  let filesRead = 0;

  function doneReading() {
    if (++filesRead < 2) return;

    const mismatchedPixels = pixelmatch(imgA.data, imgB.data, null, pixelMatchInput.width, pixelMatchInput.height, {
      threshold: pixelMatchInput.pixelmatchThreshold,
      includeAA: false
    });

    process.send(mismatchedPixels);
  }
}

process.on('message', getMismatchedPixels);
