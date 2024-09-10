import type * as d from '../../declarations';
import { UnvalidatedConfig } from '../../declarations';
import { isHexColor } from '../docs/readme/docs-util';
import { DEFAULT_TARGET_COMPONENT_STYLES } from './constants';

/**
 * Validate the `.docs` property on the supplied config object and
 * return a properly-validated value.
 *
 * @param config the configuration we're examining
 * @returns a suitable/default value for the docs property
 */
export const validateDocs = (config: UnvalidatedConfig): d.ValidatedConfig['docs'] => {
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

  return {
    markdown: {
      targetComponent: {
        background,
        textColor,
      },
    },
  };
};
