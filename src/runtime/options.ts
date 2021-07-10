import * as d from '../declarations';

const options: d.CustomElementsDefineOptions = {};

export const setOptions = (opts: d.CustomElementsDefineOptions) => {
    Object.assign(options, opts);
};

export const getOptions = () => {
  return options; 
};
