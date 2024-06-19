/**
 * Note: this file is meant to be run in the browser, not in Node.js. WebdriverIO
 * injects some basic polyfills for Node.js to make the following possible.
 */
import path from 'node:path';

/**
 * A namespace for custom type definitions used in a portion of the testing suite
 */
export declare namespace SomeTypes {
  type Number = number;
  type String = string;
}

export async function setupIFrameTest(htmlFile: string): Promise<HTMLElement> {
  if (document.querySelector('iframe')) {
    document.body.removeChild(document.querySelector('iframe'));
  }

  const htmlFilePath = path.resolve(
    path.dirname(globalThis.__wdioSpec__),
    '..',
    htmlFile.slice(htmlFile.startsWith('/') ? 1 : 0),
  );
  const iframe = document.createElement('iframe');

  /**
   * Note: prefixes the absolute path to the html file with `/@fs` is a ViteJS (https://vitejs.dev/)
   * feature which allows to serve static content from files this way
   */
  iframe.src = `/@fs${htmlFilePath}`;
  iframe.width = '600px';
  iframe.height = '600px';
  document.body.appendChild(iframe);

  /**
   * wait for the iframe to load
   */
  await new Promise((resolve) => (iframe.onload = resolve));
  return iframe.contentDocument.body;
}
