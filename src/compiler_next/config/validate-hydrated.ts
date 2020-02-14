import { Config, HydratedFlag } from '../../declarations';
import { isString } from '@utils';


export const validateHydrated = (config: Config) => {
  if (config.hydratedFlag === null || config.hydratedFlag === false) {
    return null;
  }

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
