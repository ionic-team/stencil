import * as d from '../../declarations';
import { unduplicate } from '@utils';

export function validateCopy(copy: d.CopyTask[] | boolean, defaultCopy: d.CopyTask[] = []): d.CopyTask[] {
  if (copy === null || copy === false) {
    return [];
  }
  if (!Array.isArray(copy)) {
    copy = [];
  }
  return unduplicate([
    ...defaultCopy,
    ...copy
  ], task => task.src);
}
