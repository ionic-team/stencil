import type * as d from '../../declarations';
import { buildError } from '@utils';
import { relative } from 'path';

export const validateTranspiledComponents = (config: d.Config, buildCtx: d.BuildCtx) => {
  for (const cmp of buildCtx.components) {
    validateUniqueTagNames(config, buildCtx, cmp);
  }
};

const validateUniqueTagNames = (config: d.Config, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta) => {
  const tagName = cmp.tagName;
  const cmpsWithTagName = buildCtx.components.filter((c) => c.tagName === tagName);
  if (cmpsWithTagName.length > 1) {
    const err = buildError(buildCtx.diagnostics);
    err.header = `Component Tag Name "${tagName}" Must Be Unique`;
    err.messageText = `Please update the components so "${tagName}" is only used once: ${cmpsWithTagName
      .map((c) => relative(config.rootDir, c.sourceFilePath))
      .join(' ')}`;
  }
};
