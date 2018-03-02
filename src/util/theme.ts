

export function createThemedClasses(mode: string, color: string, classList: string) {
  const allClasses: any = {};

  return classList.split(' ')
    .reduce((classObj: any, classString: string) => {
      classObj[classString] = true;

      if (mode) {
        classObj[`${classString}-${mode}`] = true;

        if (color) {
          classObj[`${classString}-${color}`] = true;
          classObj[`${classString}-${mode}-${color}`] = true;
        }
      }

      return classObj;
    }, allClasses);
}
