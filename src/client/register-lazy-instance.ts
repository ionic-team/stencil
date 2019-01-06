import * as d from '../declarations';
import { refs } from './data';


export const registerLazyInstance = (lazyInstance: any, elmData: d.ElementData) =>
  refs.set(elmData.instance = lazyInstance, elmData);
