var state = 0;

function concat(t, c) {
  return state++, "".concat(state, " ").concat(t, " ").concat(c);
}

export { concat };