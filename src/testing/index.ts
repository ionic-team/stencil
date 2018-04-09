
export { h } from '../renderer/vdom/h';
export { transpile } from './test-transpile';
export { TestWindow } from './test-window';



/**
 * DEPRECATED 2018-04-08
 */
import { TestWindow, TestWindowLoadOptions } from './test-window';

const windows = new WeakMap<any, TestWindow>();
let hasWarnedRender = false;
let hasWarnedFlush = false;

/**
 * DEPRECATED: Please use TestWindow instead.
 */
export async function render(opts: TestWindowLoadOptions) {
  if (!hasWarnedRender) {
    console.warn([
      `Testing "render()" has been deprecated in favor of using "TestWindow". `,
      `Instead of "render(opts)", please use "const window = new TestWindow(); window.load(opts);". `,
      `This update allows testing to better simulate the standardized window and document objects.`
    ].join('\n'));
    hasWarnedRender = true;
  }

  const window = new TestWindow();
  const elm: any = await window.load(opts);

  windows.set(elm, window);

  return elm;
}


/**
 * DEPRECATED: Please use TestWindow instead.
 */
export async function flush(elm: any) {
  if (!hasWarnedFlush) {
    console.warn([
      `Testing "flush()" has been deprecated in favor of using "TestWindow". `,
      `Instead of "flush(elm)", please use the TestWindow "flush()" method.`,
      `This update allows testing to better simulate the standardized window and document objects.`
    ].join('\n'));
    hasWarnedFlush = true;
  }

  const window = windows.get(elm);
  if (window) {
    await window.flush();
  }
}
