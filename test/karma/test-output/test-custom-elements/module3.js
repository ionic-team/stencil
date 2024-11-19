var state = 0;
function concat(a, b) {
  state++;
  return `${state} ${a} ${b}`;
}

export { concat };
