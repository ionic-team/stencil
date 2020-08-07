import type * as d from '../../declarations';
import { unique } from '@utils';

export const validateCopy = (copy: d.CopyTask[] | boolean, defaultCopy: d.CopyTask[] = []): d.CopyTask[] => {
  if (copy === null || copy === false) {
    return [];
  }
  if (!Array.isArray(copy)) {
    copy = [];
  }
  copy = copy.slice();
  for (const task of defaultCopy) {
    if (copy.every(t => t.src !== task.src)) {
      copy.push(task);
    }
  }
  return unique(copy, task => `${task.src}:${task.dest}:${task.keepDirStructure}`);
};
