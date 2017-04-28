import { NextTickApi } from '../util/interfaces';


export function NextTickServer(): NextTickApi {
  return {
    nextTick: process.nextTick
  };
}
