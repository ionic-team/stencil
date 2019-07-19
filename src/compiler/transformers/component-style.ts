import * as d from '../../declarations';
import { createStaticGetter } from './transform-utils';
import { getStyleTextPlaceholder } from '../app-core/component-styles';
import ts from 'typescript';


export const addComponentStyle = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (!cmp.hasStyle) {
    return;
  }

  classMembers.push(createStaticGetter('style', ts.createStringLiteral(getStyleTextPlaceholder(cmp))));
};
