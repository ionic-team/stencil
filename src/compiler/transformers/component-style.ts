import * as d from '../../declarations';
import { createStaticGetter } from './transform-utils';
import { getStyleIdPlaceholder, getStyleTextPlaceholder } from '../app-core/component-styles';
import ts from 'typescript';


export function addComponentStyle(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, emitStyleId = true) {
  if (!cmp.hasStyle) {
    return;
  }

  classMembers.push(createStaticGetter('style', ts.createStringLiteral(getStyleTextPlaceholder(cmp))));
  if (emitStyleId) {
    classMembers.push(createStaticGetter('styleId', ts.createStringLiteral(getStyleIdPlaceholder(cmp))));
  }
}
