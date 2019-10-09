import { BUILD } from '@build-conditionals';

let i = 0;
export const createTime = (fnName: string, tagName = '') => {
  if (BUILD.profile) {
    const key = `st:${fnName}:${tagName}:${i++}`;
    // Start
    performance.mark(key);

    // End
    return () => performance.measure(`[Stencil] ${fnName}() <${tagName}>`, key);
  } else {
    return () => { return; };
  }
};

