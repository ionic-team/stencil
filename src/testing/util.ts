import { initHostConstructor } from '../core/instance/init';
import { getBuildContext } from '../compiler/util';
import { compileFileSync } from '../compiler/build/compile';
import { ComponentMeta, HostElement, PlatformApi } from '../util/interfaces';
import { MockedPlatform, mockConnect, mockDefine, mockPlatform, mockBuildConfig } from '../test/index';

let testPlatform: MockedPlatform;

export function register(components?: Array<ComponentMeta>): void {
  testPlatform = mockPlatform();

  if (components) {
    components.forEach(c => mockDefine(testPlatform, c));
  }
}

export function render(html: string): Promise<HostElement> {
  const node = mockConnect(testPlatform as MockedPlatform, html);
  return waitForLoad(node);
}

export function transpile(tsFileName: string, srcDir: string): string {
  const config = mockBuildConfig();
  config._isTesting = true;
  config.srcDir = srcDir;
  config.sys.fs = require('fs');
  const ctx = getBuildContext();
  return compileFileSync(config, ctx, tsFileName);
}

function waitForLoad(rootNode: any): Promise<HostElement> {
  return new Promise((resolve: (elm: HostElement) => void) => {
    testPlatform.$flushQueue(() => {
      // flush to read attribute mode on host elment
      testPlatform.$flushLoadBundle(() => {
        // flush to load component mode data
        testPlatform.$flushQueue(() => {
          // flush to do the update
          connectComponents(rootNode);
          resolve(rootNode.childNodes[0]);
        });
      });
    });

  }).catch(err => {
    console.error('waitForLoad', err);
    return null;
  });
}

function connectComponents(node: HostElement) {
  if (!node) return;

  if (node.tagName) {
    if (!node._hasConnected) {
      const cmpMeta = (<PlatformApi>testPlatform).getComponentMeta(node);
      if (cmpMeta) {
        initHostConstructor(<PlatformApi>testPlatform, node);
        (<HostElement>node).connectedCallback();
      }
    }
  }
  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      connectComponents(<HostElement>node.childNodes[i]);
    }
  }
}
