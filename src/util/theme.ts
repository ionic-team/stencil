import { CssClassMap } from '../util/interfaces';


export function createThemedClasses(mode: string, color: string, classList: string) {
  const allClasses: CssClassMap = {};

  return classList.split(' ')
    .reduce((classObj: CssClassMap, classString: string): CssClassMap => {
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
