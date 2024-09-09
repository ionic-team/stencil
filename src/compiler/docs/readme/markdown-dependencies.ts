import { normalizePath, relative } from '@utils';

import type * as d from '../../../declarations';
import { DEFAULT_TARGET_COMPONENT_STYLES } from './constants';
import { isHexColor } from './docs-util';

export const depsToMarkdown = (cmp: d.JsonDocsComponent, cmps: d.JsonDocsComponent[], config: d.ValidatedConfig) => {
  const content: string[] = [];

  const deps = Object.entries(cmp.dependencyGraph);

  if (deps.length === 0) {
    return content;
  }

  content.push(`## Dependencies`);
  content.push(``);

  if (cmp.dependents.length > 0) {
    const usedBy = cmp.dependents.map((tag) => ' - ' + getCmpLink(cmp, tag, cmps));

    content.push(`### Used by`);
    content.push(``);
    content.push(...usedBy);
    content.push(``);
  }

  if (cmp.dependencies.length > 0) {
    const dependsOn = cmp.dependencies.map((tag) => '- ' + getCmpLink(cmp, tag, cmps));

    content.push(`### Depends on`);
    content.push(``);
    content.push(...dependsOn);
    content.push(``);
  }

  const { background: defaultBackground, textColor: defaultTextColor } = DEFAULT_TARGET_COMPONENT_STYLES;

  let { background = defaultBackground, textColor = defaultTextColor } =
    config.docs?.markdown?.targetComponent ?? DEFAULT_TARGET_COMPONENT_STYLES;

  if (!isHexColor(background)) {
    background = defaultBackground;
    config.logger.warn('Default value for docs.markdown.targetComponent.background is being used.');
  }

  if (!isHexColor(textColor)) {
    textColor = defaultTextColor;
    config.logger.warn('Default value for docs.markdown.targetComponent.textColor is being used.');
  }

  content.push(`### Graph`);
  content.push('```mermaid');
  content.push('graph TD;');
  deps.forEach(([key, deps]) => {
    deps.forEach((dep) => {
      content.push(`  ${key} --> ${dep}`);
    });
  });

  content.push(`  style ${cmp.tag} fill:${background},stroke:${textColor},stroke-width:4px`);

  content.push('```');

  content.push(``);

  return content;
};

const getCmpLink = (from: d.JsonDocsComponent, to: string, cmps: d.JsonDocsComponent[]) => {
  const destCmp = cmps.find((c) => c.tag === to);
  if (destCmp) {
    const cmpRelPath = normalizePath(relative(from.dirPath, destCmp.dirPath));
    return `[${to}](${cmpRelPath})`;
  }
  return to;
};
