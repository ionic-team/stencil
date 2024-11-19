var state = 0;
export function concat(a, b) {
  state++;
  return `${state} ${a} ${b}`;
}
