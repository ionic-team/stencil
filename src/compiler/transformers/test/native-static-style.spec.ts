import { mockBuildCtx } from '@stencil/core/testing';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { addNativeStaticStyle } from '../component-native/native-static-style';

describe('native static style', () => {
  it('exposes a source map for a single external default style', () => {
    const buildCtx = mockBuildCtx();
    (buildCtx.config as any).sourceMapCss = true;
    const component = {
      componentClassName: 'MyComponent',
      tagName: 'my-component',
      encapsulation: 'shadow',
      styles: [
        {
          modeName: '$',
          externalStyles: [{ absolutePath: '/path/to/style.css' }],
        },
      ],
    } as d.ComponentCompilerMeta;
    const classMembers: ts.ClassElement[] = [];

    addNativeStaticStyle(classMembers, component, buildCtx);

    expect(classMembers).toHaveLength(2);
  });
});
