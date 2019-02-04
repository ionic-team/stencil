import * as d from '@declarations';
import { createStaticGetter } from './transform-utils';
import { getStyleIdPlaceholder, getStyleTextPlaceholder } from '../app-core/component-styles';
import ts from 'typescript';


export function addComponentStyle(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  if (!cmp.hasStyle) {
    return;
  }

  if (cmp.hasMode) {
    classMembers.push(createStaticGetter('mode', ts.createStringLiteral(getStyleIdPlaceholder(cmp))));
  }

  classMembers.push(createStaticGetter('style', ts.createStringLiteral(getStyleTextPlaceholder(cmp))));
}
