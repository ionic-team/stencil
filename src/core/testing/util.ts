import { initHostConstructor } from '../instance/init';
import { getBuildContext } from '../../compiler/util';
import { compileFileSync } from '../../compiler/build/compile';
import { ComponentMeta, HostElement, PlatformApi } from '../../util/interfaces';
import { MockedPlatform, mockConnect, mockDefine, mockPlatform, mockBuildConfig } from '../../test';

export function register(components?: Array<ComponentMeta>): PlatformApi {
  const platform = mockPlatform();

  if (components) {
    components.forEach(c => mockDefine(platform, c));
  }

  return platform as PlatformApi;
}

export function render(platform: PlatformApi, html: string): Promise<HostElement> {
  const node = mockConnect(platform as MockedPlatform, html);
  return waitForLoad(platform, node);
}

export function transpile(tsFileName: string): string {
  const config = mockBuildConfig();
  config.sys.fs = require('fs');
  const ctx = getBuildContext();
  return compileFileSync(config, ctx, tsFileName);
}

function waitForLoad(platform: PlatformApi, rootNode: any): Promise<HostElement> {
  return new Promise((resolve: (elm: HostElement) => void) => {
    (<MockedPlatform>platform).$flushQueue(() => {
      // flush to read attribute mode on host elment
      (<MockedPlatform>platform).$flushLoadBundle(() => {
        // flush to load component mode data
        (<MockedPlatform>platform).$flushQueue(() => {
          // flush to do the update
          connectComponents(platform, rootNode);
          resolve(rootNode.childNodes[0]);
        });
      });
    });

  }).catch(err => {
    console.error('waitForLoad', err);
    return null;
  });
}

// Copied verbatim from test/inject.js, more of that should be moved here and cleaned up as needed or removed
// in a couple of iterations of:
//   1 -
function connectComponents(platform: PlatformApi, node: HostElement) {
  if (!node) return;

  if (node.tagName) {
    if (!node._hasConnected) {
      const cmpMeta = platform.getComponentMeta(node);
      if (cmpMeta) {
        initHostConstructor(platform, node);
        (<HostElement>node).connectedCallback();
      }
    }
  }
  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      connectComponents(platform, <HostElement>node.childNodes[i]);
    }
  }
}
