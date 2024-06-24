import { BUILD } from '@app-data';
import { isComplexType, MEMBER_FLAGS } from '@utils';

/**
 * Parse a new property value for a given property type.
 *
 * While the prop value can reasonably be expected to be of `any` type as far as TypeScript's type checker is concerned,
 * it is not safe to assume that the string returned by evaluating `typeof propValue` matches:
 *   1. `any`, the type given to `propValue` in the function signature
 *   2. the type stored from `propType`.
 *
 * This function provides the capability to parse/coerce a property's value to potentially any other JavaScript type.
 *
 * Property values represented in TSX preserve their type information. In the example below, the number 0 is passed to
 * a component. This `propValue` will preserve its type information (`typeof propValue === 'number'`). Note that is
 * based on the type of the value being passed in, not the type declared of the class member decorated with `@Prop`.
 * ```tsx
 * <my-cmp prop-val={0}></my-cmp>
 * ```
 *
 * HTML prop values on the other hand, will always a string
 *
 * @param propValue the new value to coerce to some type
 * @param propType the type of the prop, expressed as a binary number
 * @returns the parsed/coerced value
 */
export const parsePropertyValue = (propValue: any, propType: number): any => {
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
