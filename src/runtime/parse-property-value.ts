import { MEMBER_FLAGS, isComplexType } from '@utils';
import { BUILD } from '@app-data';

export const parsePropertyValue = (propValue: any, propType: number) => {
  // ensure this value is of the correct prop type

  if (propValue != null && !isComplexType(propValue)) {
    if (BUILD.propBoolean && propType & MEMBER_FLAGS.Boolean) {
      // per the HTML spec, any string value means it is a boolean true value
      // but we'll cheat here and say that the string "false" is the boolean false
      return propValue === 'false' ? false : propValue === '' || !!propValue;
    }

    if (BUILD.propNumber && propType & MEMBER_FLAGS.Number) {
      // force it to be a number
      return parseFloat(propValue);
    }

    if (BUILD.propString && propType & MEMBER_FLAGS.String) {
      // could have been passed as a number or boolean
      // but we still want it as a string
      return String(propValue);
    }

    // redundant return here for better minification
    return propValue;
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
};
