import { hello, world } from './module2';
var state = 0;
export async function getResult() {
  const concat = (await import('./module3')).concat;
  state++;
  return concat(hello(), world()) + state;
}
