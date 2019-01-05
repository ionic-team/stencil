

export const parsePropertyValue = (isTypeBoolean: boolean, isTypeNumber: boolean, isTypeString: number, propValue: any) => {
  // ensure this value is of the correct prop type
  // we're testing both formats of the "propType" value because
  // we could have either gotten the data from the attribute changed callback,
  // which wouldn't have Constructor data yet, and because this method is reused
  // within proxy where we don't have meta data, but only constructor data

  if (propValue != null && typeof propValue !== 'object' && typeof propValue !== 'function') {
    if (isTypeBoolean) {
      // per the HTML spec, any string value means it is a boolean true value
      // but we'll cheat here and say that the string "false" is the boolean false
      return (propValue === 'false' ? false : propValue === '' || !!propValue);
    }

    if (isTypeNumber) {
      // force it to be a number
      return parseFloat(propValue);
    }

    if (isTypeString) {
      // could have been passed as a number or boolean
      // but we still want it as a string
      return propValue.toString();
    }

    // redundant return here but for better minification
    return propValue;
  }

  // not sure exactly what type we want
  // so no need to change to a different type
  return propValue;
};
