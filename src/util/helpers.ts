
export const isDef = (v: any) => v !== undefined && v !== null;

export const isUndef = (v: any) => v === undefined || v === null;

export const isBoolean = (v: any): v is boolean => typeof v === 'boolean';

export const isString = (v: any): v is string => typeof v === 'string';

export const isNumber = (v: any): v is number => typeof v === 'number';

export const toLowerCase = (str: string) => str.toLowerCase();

export const toDashCase = (str: string) => toLowerCase(str.replace(/([A-Z])/g, g => ' ' + g[0]).trim().replace(/ /g, '-'));

export const dashToPascalCase = (str: string) => toLowerCase(str).split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');

export const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.substr(1);

export const noop = (): any => {};
