import { HydratedFlag, UnvalidatedConfig } from '../../declarations';
import { isString } from '@utils';

/**
 * Check the provided `.hydratedFlag` prop and return a properly-validated value.
 *
 * @param config the configuration we're examining
 * @returns a suitable value for the hydratedFlag property
 */
export const validateHydrated = (config: UnvalidatedConfig): HydratedFlag | undefined => {
  /**
   * If `config.hydratedFlag` is set to `null` that is an explicit signal that we
   * should _not_ create a default configuration when validating and should instead
   * just return `undefined`.
   *
   * See {@link HydratedFlag} for more details.
   */
  if (config.hydratedFlag === null || config.hydratedFlag === false) {
    return undefined;
  }

  // Here we start building up a default config since `.hydratedFlag` wasn't set to
  // `null` on the provided config.
  const hydratedFlag: HydratedFlag = { ...config.hydratedFlag };

  if (!isString(hydratedFlag.name) || hydratedFlag.property === '') {
    hydratedFlag.name = `hydrated`;
  }

  if (hydratedFlag.selector === 'attribute') {
    hydratedFlag.selector = `attribute`;
  } else {
    hydratedFlag.selector = `class`;
  }

  if (!isString(hydratedFlag.property) || hydratedFlag.property === '') {
    hydratedFlag.property = `visibility`;
  }

  if (!isString(hydratedFlag.initialValue) && hydratedFlag.initialValue !== null) {
    hydratedFlag.initialValue = `hidden`;
  }

  if (!isString(hydratedFlag.hydratedValue) && hydratedFlag.initialValue !== null) {
    hydratedFlag.hydratedValue = `inherit`;
  }

  return hydratedFlag;
};
